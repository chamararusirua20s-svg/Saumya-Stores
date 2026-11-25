const Order = require("../models/Order");
const Product = require("../models/Product");
const Stripe = require("stripe");
const stripe = process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("<") ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const { sendOrderConfirmationEmail } = require("../utils/emailService");

const findSelectedVariant = (product, item) => {
  if (!product.variants || product.variants.length === 0) return null;

  const requestedId = item.selectedVariant?._id || item.variantId;
  const requestedName = item.selectedVariant?.name || item.variantName;

  if (requestedId) {
    const match = product.variants.id(requestedId);
    if (match) return match;
  }

  if (requestedName) {
    return product.variants.find(
      (variant) => variant.name.toLowerCase() === String(requestedName).toLowerCase()
    );
  }

  return product.variants.length === 1 ? product.variants[0] : null;
};

const getLastFourDigits = (value) => String(value || "").replace(/\D/g, "").slice(-4);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    lastFourDigits,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400).json({ message: "No order items" });
    return;
  } else {
    const isCreditCard = paymentMethod === "Credit Card";
    const sanitizedLastFour = getLastFourDigits(lastFourDigits);

    if (isCreditCard && sanitizedLastFour.length !== 4) {
      res.status(400).json({ message: "Last four card digits are required for credit card payments" });
      return;
    }

    const validatedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        res.status(404).json({ message: `Product not found: ${item.name}` });
        return;
      }

      const selectedVariant = findSelectedVariant(product, item);

      if (product.variants?.length && !selectedVariant) {
        res.status(400).json({ message: `Please select a size for ${product.name}` });
        return;
      }

      const availableStock = selectedVariant ? selectedVariant.stock : product.quantity;

      if (item.qty > availableStock) {
        const sizeLabel = selectedVariant ? ` (${selectedVariant.name})` : "";
        res.status(400).json({
          message: `${product.name}${sizeLabel} only has ${availableStock} items available`,
        });
        return;
      }

      // Securely calculate real price based on product data in database
      const baseVariantPrice = Number(selectedVariant ? selectedVariant.sellingPrice : product.sellingPrice || product.buyingPrice || 0);
      const discountPercent = Number(product.discount || 0);
      const calculatedPrice = Number((baseVariantPrice * (1 - discountPercent / 100)).toFixed(2));

      validatedItems.push({
        name: product.name,
        qty: Number(item.qty),
        image: product.image,
        price: calculatedPrice,
        selectedVariant: selectedVariant
          ? {
              _id: selectedVariant._id,
              name: selectedVariant.name,
              sku: selectedVariant.sku,
            }
          : {
              name: item.selectedVariant?.name || "Default",
              sku: item.selectedVariant?.sku || "",
            },
        selectedPrice: calculatedPrice,
        selectedStock: availableStock,
        selectedQuantity: Number(item.qty),
        product: item.product,
      });
    }

    // Backend calculation of totals
    const calculatedItemsPrice = validatedItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const calculatedTaxPrice = Number((calculatedItemsPrice * 0.05).toFixed(2));
    const calculatedShippingPrice = calculatedItemsPrice >= 5000 ? 0 : 250;
    const calculatedTotalPrice = Number((calculatedItemsPrice + calculatedTaxPrice + calculatedShippingPrice).toFixed(2));

    const order = new Order({
      orderItems: validatedItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      paymentStatus: isCreditCard ? "Paid" : "Pending",
      lastFourDigits: isCreditCard ? sanitizedLastFour : "",
      isPaid: isCreditCard,
      paidAt: isCreditCard ? Date.now() : undefined,
      paymentResult: isCreditCard
        ? {
            id: `demo_card_${Date.now()}`,
            status: "succeeded",
            update_time: new Date().toISOString(),
          }
        : undefined,
      itemsPrice: calculatedItemsPrice,
      taxPrice: calculatedTaxPrice,
      shippingPrice: calculatedShippingPrice,
      totalPrice: calculatedTotalPrice,
    });

    const createdOrder = await order.save();

    // Reduce stock only from the purchased variant.
    for (const item of validatedItems) {
      const product = await Product.findById(item.product);
      if (product) {
        const selectedVariant = findSelectedVariant(product, item);

        if (selectedVariant) {
          selectedVariant.stock = Math.max(0, selectedVariant.stock - item.qty);
        } else {
          product.quantity = Math.max(0, product.quantity - item.qty);
        }

        await product.save();
      }
    }

    if (paymentMethod === "Credit Card") {
      sendOrderConfirmationEmail(
        req.user.email,
        req.user.name,
        createdOrder._id,
        createdOrder.totalPrice
      ).catch((err) => console.error("Async confirmation email failed:", err));
    }

    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    const isOwner = order.user?._id?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: "Not authorized to view this order" });
      return;
    }

    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    const isOwner = order.user?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: "Not authorized to update this order" });
      return;
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentStatus = "Paid";
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
};

// @desc    Create Stripe Payment Intent
// @route   POST /api/orders/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
    const { amount } = req.body;
  
    try {
      if (!stripe) {
        return res.status(400).json({ message: "Stripe is not configured. Please provide STRIPE_SECRET_KEY in .env" });
      }
      const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  createPaymentIntent,
};
