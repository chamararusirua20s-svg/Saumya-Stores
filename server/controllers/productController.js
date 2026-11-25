const Product = require("../models/Product");

const normalizeVariants = ({ variants, buyingPrice, sellingPrice, quantity, barcode }) => {
  const source =
    Array.isArray(variants) && variants.length > 0
      ? variants
      : [
          {
            name: "Default",
            buyingPrice,
            sellingPrice,
            stock: quantity,
            sku: barcode,
          },
        ];

  return source.map((variant, index) => ({
    _id: variant._id,
    name: String(variant.name || `Variant ${index + 1}`).trim(),
    buyingPrice: Number(variant.buyingPrice) || 0,
    sellingPrice: Number(variant.sellingPrice) || 0,
    stock: Number(variant.stock) || 0,
    sku: variant.sku ? String(variant.sku).trim() : "",
  }));
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: "i" } },
          { barcode: req.query.keyword },
          { brand: { $regex: req.query.keyword, $options: "i" } },
        ],
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .populate("category", "name")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name"
  );

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// @desc    Get product by Barcode
// @route   GET /api/products/barcode/:barcode
// @access  Public
const getProductByBarcode = async (req, res) => {
  const product = await Product.findOne({ barcode: req.params.barcode }).populate(
    "category",
    "name"
  );

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const {
    name,
    barcode,
    category,
    brand,
    description,
    buyingPrice,
    sellingPrice,
    discount,
    quantity,
    stockLevel,
    expiryDate,
    image,
    variants,
  } = req.body;

  const productExists = await Product.findOne({ barcode });

  if (productExists) {
    res.status(400).json({ message: "Product with this barcode already exists" });
    return;
  }

  const normalizedVariants = normalizeVariants({
    variants,
    buyingPrice,
    sellingPrice,
    quantity,
    barcode,
  });

  const product = new Product({
    name,
    barcode,
    category,
    brand,
    description,
    buyingPrice: normalizedVariants[0].buyingPrice,
    sellingPrice: normalizedVariants[0].sellingPrice,
    discount,
    quantity: normalizedVariants.reduce((sum, variant) => sum + variant.stock, 0),
    variants: normalizedVariants,
    stockLevel,
    expiryDate,
    image,
    user: req.user._id,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const {
    name,
    barcode,
    category,
    brand,
    description,
    buyingPrice,
    sellingPrice,
    discount,
    quantity,
    stockLevel,
    expiryDate,
    image,
    variants,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name !== undefined ? name : product.name;
    product.barcode = barcode !== undefined ? barcode : product.barcode;
    product.category = category !== undefined ? category : product.category;
    product.brand = brand !== undefined ? brand : product.brand;
    product.description = description !== undefined ? description : product.description;
    product.buyingPrice = buyingPrice !== undefined ? buyingPrice : product.buyingPrice;
    product.sellingPrice = sellingPrice !== undefined ? sellingPrice : product.sellingPrice;
    product.discount = discount !== undefined ? discount : product.discount;
    product.quantity = quantity !== undefined ? quantity : product.quantity;
    if (variants !== undefined) {
      product.variants = normalizeVariants({
        variants,
        buyingPrice: product.buyingPrice,
        sellingPrice: product.sellingPrice,
        quantity: product.quantity,
        barcode: product.barcode,
      });
    } else if (buyingPrice !== undefined || sellingPrice !== undefined || quantity !== undefined) {
      if (!product.variants || product.variants.length === 0) {
        product.variants = normalizeVariants({
          variants: [],
          buyingPrice: product.buyingPrice,
          sellingPrice: product.sellingPrice,
          quantity: product.quantity,
          barcode: product.barcode,
        });
      } else {
        product.variants[0].buyingPrice = product.buyingPrice;
        product.variants[0].sellingPrice = product.sellingPrice;
        product.variants[0].stock = product.quantity;
      }
    }
    product.stockLevel = stockLevel !== undefined ? stockLevel : product.stockLevel;
    product.expiryDate = expiryDate !== undefined ? expiryDate : product.expiryDate;
    product.image = image !== undefined ? image : product.image;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductByBarcode,
  deleteProduct,
  createProduct,
  updateProduct,
};
