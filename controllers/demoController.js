const jwt = require("jsonwebtoken");
const { categories, products, users } = require("../utils/sampleData");

// ──────────────────────────────────────────────────────────────────────────────
// In-memory demo store (simulates database models in memory)
// ──────────────────────────────────────────────────────────────────────────────

const adminObj = users.find(u => u.role === "admin");
const customerObj = users.find(u => u.role === "customer");

const DEMO_ADMIN = {
  _id: "demo_admin_001",
  name: adminObj.name,
  email: adminObj.email,
  password: adminObj.password,
  role: "admin",
};

const DEMO_USERS = [
  {
    _id: "u_1",
    name: customerObj.name,
    email: customerObj.email,
    password: customerObj.password,
    role: "customer",
    createdAt: new Date("2026-07-01T12:00:00Z"),
  },
  {
    _id: "u_2",
    name: "Nimal Silva",
    email: "nimal@gmail.com",
    password: "Password@123",
    role: "customer",
    createdAt: new Date("2026-07-03T14:30:00Z"),
  },
  {
    _id: "u_3",
    name: "Saman Kumara",
    email: "saman@gmail.com",
    password: "Password@123",
    role: "customer",
    createdAt: new Date("2026-07-05T09:15:00Z"),
  }
];

const DEMO_CATEGORIES = categories.map((cat, i) => ({
  _id: `cat_${i + 1}`,
  name: cat.name,
  image: cat.image,
  description: cat.description,
}));

const DEMO_PRODUCTS = products.map((prod, i) => {
  const catObj = DEMO_CATEGORIES.find(c => c.name === prod.categoryName) || { _id: "cat_unknown", name: "Grocery" };
  return {
    _id: `p_${i + 1}`,
    name: prod.name,
    barcode: prod.barcode,
    category: catObj,
    brand: prod.brand,
    description: prod.description,
    buyingPrice: prod.buyingPrice,
    sellingPrice: prod.sellingPrice,
    discount: i % 5 === 0 ? 10 : 0, // Apply 10% discount to some items for realism
    quantity: prod.quantity,
    stockLevel: prod.stockLevel,
    variants: [
      {
        _id: `v_${i + 1}_default`,
        name: prod.name.match(/\b(\d+(?:\.\d+)?\s?(?:ml|l|kg|g|pack))\b/i)?.[1] || "Default",
        buyingPrice: prod.buyingPrice,
        sellingPrice: prod.sellingPrice,
        stock: prod.quantity,
        sku: prod.barcode,
      },
    ],
    image: prod.image,
    averageRating: 4.5,
    numReviews: Math.floor(Math.random() * 20) + 5,
    expiryDate: "2026-12-31",
  };
});

const normalizeDemoVariants = (product) => {
  const variants =
    Array.isArray(product.variants) && product.variants.length > 0
      ? product.variants
      : [
          {
            _id: `v_${Date.now()}_default`,
            name: "Default",
            buyingPrice: product.buyingPrice || 0,
            sellingPrice: product.sellingPrice || 0,
            stock: product.quantity || 0,
            sku: product.barcode || "",
          },
        ];

  product.variants = variants.map((variant, index) => ({
    _id: variant._id || `v_${Date.now()}_${index}`,
    name: variant.name || `Variant ${index + 1}`,
    buyingPrice: Number(variant.buyingPrice) || 0,
    sellingPrice: Number(variant.sellingPrice) || 0,
    stock: Number(variant.stock) || 0,
    sku: variant.sku || "",
  }));

  product.buyingPrice = product.variants[0].buyingPrice;
  product.sellingPrice = product.variants[0].sellingPrice;
  product.quantity = product.variants.reduce((total, variant) => total + variant.stock, 0);
  return product;
};

const DEMO_ORDERS = [
  {
    _id: "ord_1",
    user: { _id: "u_1", name: "Customer User" },
    orderItems: [
      { name: "Tomato", qty: 2, price: 120, product: "p_1", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80" },
      { name: "Fresh Milk 1L", qty: 1, price: 290, product: "p_19", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80" }
    ],
    shippingAddress: { address: "123 Main St", city: "Colombo", postalCode: "00100", country: "Sri Lanka" },
    paymentMethod: "Credit Card",
    itemsPrice: 530,
    taxPrice: 26.5,
    shippingPrice: 250,
    totalPrice: 806.5,
    isPaid: true,
    paidAt: new Date("2026-07-06T10:00:00Z"),
    isDelivered: true,
    createdAt: new Date("2026-07-06T10:00:00Z"),
  },
  {
    _id: "ord_2",
    user: { _id: "u_2", name: "Nimal Silva" },
    orderItems: [
      { name: "Keeri Samba Rice 5kg", qty: 1, price: 1650, product: "p_33", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80" }
    ],
    shippingAddress: { address: "45 Galle Rd", city: "Galle", postalCode: "00200", country: "Sri Lanka" },
    paymentMethod: "Cash on Delivery",
    itemsPrice: 1650,
    taxPrice: 82.5,
    shippingPrice: 250,
    totalPrice: 1982.5,
    isPaid: true,
    paidAt: new Date("2026-07-07T08:30:00Z"),
    isDelivered: false,
    createdAt: new Date("2026-07-07T08:30:00Z"),
  }
];

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "demo_secret", { expiresIn: "30d" });

// ──────────────────────────────────────────────────────────────────────────────
// Auth Controller Methods
// ──────────────────────────────────────────────────────────────────────────────
const demoLogin = (req, res) => {
  const { email, password } = req.body;
  if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
    return res.json({
      _id: DEMO_ADMIN._id,
      name: DEMO_ADMIN.name,
      email: DEMO_ADMIN.email,
      role: DEMO_ADMIN.role,
      token: generateToken(DEMO_ADMIN._id),
    });
  }
  const user = DEMO_USERS.find(u => u.email === email);
  if (user && (password === user.password || password === "password")) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  }
  res.status(401).json({ message: "Invalid email or password" });
};

const demoRegister = (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });
  const exists = DEMO_USERS.find(u => u.email === email) || DEMO_ADMIN.email === email;
  if (exists) return res.status(400).json({ message: "User already exists" });
  
  const newUser = {
    _id: `u_${Date.now()}`,
    name,
    email,
    phone,
    password,
    role: "customer",
    createdAt: new Date(),
  };
  DEMO_USERS.push(newUser);
  res.status(201).json({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token: generateToken(newUser._id),
  });
};

const demoGetUsers = (req, res) => {
  // Return all users for Admin Dashboard
  res.json(DEMO_USERS);
};

// ──────────────────────────────────────────────────────────────────────────────
// Products Controller Methods
// ──────────────────────────────────────────────────────────────────────────────
const demoGetProducts = (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = (req.query.keyword || "").toLowerCase();
  
  let filtered = DEMO_PRODUCTS;
  if (keyword) {
    filtered = filtered.filter(
      p => p.name.toLowerCase().includes(keyword) || 
           p.barcode.includes(keyword) || 
           p.brand.toLowerCase().includes(keyword)
    );
  }
  
  const count = filtered.length;
  const products = filtered.slice((page - 1) * pageSize, page * pageSize);
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

const demoGetProductById = (req, res) => {
  const product = DEMO_PRODUCTS.find(p => p._id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

const demoCreateProduct = (req, res) => {
  const catObj = DEMO_CATEGORIES.find(c => c._id === req.body.category) || { _id: req.body.category, name: "Grocery" };
  const p = {
    _id: `p_${Date.now()}`,
    ...req.body,
    category: catObj,
    averageRating: 0,
    numReviews: 0,
  };
  DEMO_PRODUCTS.unshift(normalizeDemoVariants(p));
  res.status(201).json(DEMO_PRODUCTS[0]);
};

const demoUpdateProduct = (req, res) => {
  const idx = DEMO_PRODUCTS.findIndex(p => p._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Product not found" });
  
  const catObj = DEMO_CATEGORIES.find(c => c._id === req.body.category) || DEMO_PRODUCTS[idx].category;
  DEMO_PRODUCTS[idx] = normalizeDemoVariants({
    ...DEMO_PRODUCTS[idx],
    ...req.body,
    category: catObj,
    _id: req.params.id,
  });
  res.json(DEMO_PRODUCTS[idx]);
};

const demoDeleteProduct = (req, res) => {
  const idx = DEMO_PRODUCTS.findIndex(p => p._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Product not found" });
  DEMO_PRODUCTS.splice(idx, 1);
  res.json({ message: "Product removed" });
};

const demoGetProductByBarcode = (req, res) => {
  const product = DEMO_PRODUCTS.find(p => p.barcode === req.params.barcode);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

// ──────────────────────────────────────────────────────────────────────────────
// Categories Controller Methods
// ──────────────────────────────────────────────────────────────────────────────
const demoGetCategories = (req, res) => res.json(DEMO_CATEGORIES);

const demoCreateCategory = (req, res) => {
  const cat = {
    _id: `cat_${Date.now()}`,
    name: req.body.name,
    description: req.body.description,
    image: req.body.image || "https://via.placeholder.com/300?text=Category+Image",
  };
  DEMO_CATEGORIES.push(cat);
  res.status(201).json(cat);
};

const demoDeleteCategory = (req, res) => {
  const idx = DEMO_CATEGORIES.findIndex(c => c._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Category not found" });
  DEMO_CATEGORIES.splice(idx, 1);
  res.json({ message: "Category removed" });
};

// ──────────────────────────────────────────────────────────────────────────────
// Orders Controller Methods
// ──────────────────────────────────────────────────────────────────────────────
const demoGetOrders = (req, res) => res.json(DEMO_ORDERS);

const demoCreateOrder = (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
  
  // Find customer placing the order
  const userId = req.user ? req.user._id : "u_1";
  const userObj = DEMO_USERS.find(u => u._id === userId) || { _id: userId, name: "Customer User" };
  
  const order = {
    _id: `ord_${Date.now()}`,
    user: { _id: userObj._id, name: userObj.name },
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid: paymentMethod === "Credit Card",
    paidAt: paymentMethod === "Credit Card" ? new Date() : null,
    isDelivered: false,
    createdAt: new Date(),
  };

  // Reduce Stock in-memory
  if (orderItems && orderItems.length > 0) {
    orderItems.forEach(item => {
      const prod = DEMO_PRODUCTS.find(p => p._id === item.product);
      if (prod) {
        const selectedVariant = prod.variants?.find(
          variant =>
            variant._id === item.selectedVariant?._id ||
            variant.name === item.selectedVariant?.name
        ) || (prod.variants?.length === 1 ? prod.variants[0] : null);

        if (selectedVariant) {
          selectedVariant.stock = Math.max(0, selectedVariant.stock - item.qty);
        } else {
          prod.quantity = Math.max(0, prod.quantity - item.qty);
        }
        normalizeDemoVariants(prod);
      }
    });
  }

  DEMO_ORDERS.unshift(order);
  res.status(201).json(order);
};

// ──────────────────────────────────────────────────────────────────────────────
// Dashboard & Reports
// ──────────────────────────────────────────────────────────────────────────────
const demoDashboardStats = (req, res) => {
  const paidOrders = DEMO_ORDERS.filter(o => o.isPaid);
  const totalRevenue = DEMO_ORDERS.reduce((acc, o) => acc + o.totalPrice, 0); // Include COD as sales too for demo
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = DEMO_ORDERS.filter(o => new Date(o.createdAt) >= today).length;
  
  const variantStocks = (product) => product.variants?.map(v => Number(v.stock) || 0) || [product.quantity || 0];
  const lowStock = DEMO_PRODUCTS.filter(p =>
    variantStocks(p).some(stock => stock > 0 && stock <= p.stockLevel)
  ).length;
  const outOfStock = DEMO_PRODUCTS.filter(p =>
    variantStocks(p).some(stock => stock === 0)
  ).length;

  // Build weekly sales report (last 7 days)
  const weeklySales = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const label = d.toISOString().split("T")[0];
    
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);
    
    const total = DEMO_ORDERS
      .filter(o => new Date(o.createdAt) >= d && new Date(o.createdAt) <= dayEnd)
      .reduce((acc, o) => acc + o.totalPrice, 0);
      
    weeklySales.push({ _id: label, total });
  }

  res.json({
    totalProducts: DEMO_PRODUCTS.length,
    totalCategories: DEMO_CATEGORIES.length,
    totalCustomers: DEMO_USERS.length,
    todayOrders,
    totalRevenue,
    lowStockCount: lowStock,
    outOfStockCount: outOfStock,
    weeklySales,
  });
};

// ──────────────────────────────────────────────────────────────────────────────
// Upload Placeholder
// ──────────────────────────────────────────────────────────────────────────────
const demoUpload = (req, res) => {
  res.json("https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80");
};

const demoGetUserProfile = (req, res) => {
  if (req.user._id === "demo_admin_001") {
    res.json({
      _id: DEMO_ADMIN._id,
      name: DEMO_ADMIN.name,
      email: DEMO_ADMIN.email,
      role: DEMO_ADMIN.role,
    });
  } else {
    const user = DEMO_USERS.find(u => u._id === req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.json({
        _id: req.user._id,
        name: "Customer User",
        email: "customer@gmail.com",
        role: "customer",
      });
    }
  }
};

module.exports = {
  // Auth
  demoLogin,
  demoRegister,
  demoGetUsers,
  demoGetUserProfile,
  // Products
  demoGetProducts,
  demoGetProductById,
  demoCreateProduct,
  demoUpdateProduct,
  demoDeleteProduct,
  demoGetProductByBarcode,
  // Categories
  demoGetCategories,
  demoCreateCategory,
  demoDeleteCategory,
  // Orders
  demoGetOrders,
  demoCreateOrder,
  // Dashboard
  demoDashboardStats,
  // Upload
  demoUpload,
  // Admin Object
  DEMO_ADMIN,
};
