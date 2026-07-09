const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors    = require("cors");
const morgan  = require("morgan");
const helmet  = require("helmet");
const path    = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");

// ── Demo-mode controllers ─────────────────────────────────────────────────────
const demo = require("./controllers/demoController");

// ── Real controllers (for inline use) ────────────────────────────────────────
const { loginUser, registerUser, getUserProfile, getUsers } = require("./controllers/authController");
const { protect, admin } = require("./middleware/authMiddleware");

// ── Real route modules (for complex routes) ───────────────────────────────────
const productRoutes  = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes    = require("./routes/orderRoutes");
const reportRoutes   = require("./routes/reportRoutes");
const uploadRoutes   = require("./routes/uploadRoutes");
const offerRoutes    = require("./routes/offerRoutes");
const homeContentRoutes = require("./routes/homeContentRoutes");
const { defaultOffers } = require("./controllers/offerController");
const { defaultHomeContent } = require("./controllers/homeContentController");

// Connect MongoDB
connectDB();

const app = express();

// ── Core Middleware ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(helmet({ crossOriginResourcePolicy: false }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// ── Helper: is MongoDB connected? ─────────────────────────────────────────────
const isDBConnected = () => mongoose.connection.readyState === 1;

// ── Demo JWT Middleware ────────────────────────────────────────────────────────
const demoProtect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET || "demo_secret");
    req.user = {
      _id: decoded.id,
      role: decoded.id === "demo_admin_001" ? "admin" : "customer",
    };
    next();
  } catch {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const demoAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  res.status(403).json({ message: "Not authorized as an admin" });
};

let DEMO_OFFERS = defaultOffers.map((offer, index) => ({
  ...offer,
  _id: `offer_${index + 1}`,
  id: `offer_${index + 1}`,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

let DEMO_HOME_CONTENT = {
  ...defaultHomeContent,
  _id: "home_content_demo",
  heroSlides: defaultHomeContent.heroSlides.map((slide, index) => ({
    ...slide,
    _id: `slide_${index + 1}`,
    id: `slide_${index + 1}`,
  })),
  promotionalBanners: defaultHomeContent.promotionalBanners.map((banner, index) => ({
    ...banner,
    _id: `promo_${index + 1}`,
    id: `promo_${index + 1}`,
  })),
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ── Universal auth/protection middleware ─────────────────────────────────────
// Chooses real JWT protect OR demo protect based on DB state
const universalProtect = (req, res, next) => {
  if (isDBConnected()) return protect(req, res, next);
  return demoProtect(req, res, next);
};

const universalAdmin = (req, res, next) => {
  if (isDBConnected()) return admin(req, res, next);
  return demoAdmin(req, res, next);
};

// ── AUTH Routes ───────────────────────────────────────────────────────────────
app.post("/api/auth/login", (req, res) => {
  if (isDBConnected()) return loginUser(req, res);
  return demo.demoLogin(req, res);
});

app.post("/api/auth/register", (req, res) => {
  if (isDBConnected()) return registerUser(req, res);
  return demo.demoRegister(req, res);
});

app.get("/api/auth/profile", universalProtect, (req, res) => {
  if (isDBConnected()) return getUserProfile(req, res);
  return demo.demoGetUserProfile(req, res);
});

app.get("/api/auth/users", universalProtect, universalAdmin, (req, res) => {
  if (isDBConnected()) return getUsers(req, res);
  return demo.demoGetUsers(req, res);
});

// ── PRODUCT Routes ─────────────────────────────────────────────────────────────
app.get("/api/products/barcode/:barcode", universalProtect, (req, res, next) => {
  if (isDBConnected()) return next();
  return demo.demoGetProductByBarcode(req, res);
});

app.get("/api/products", (req, res, next) => {
  if (isDBConnected()) return next();
  return demo.demoGetProducts(req, res);
});

app.get("/api/products/:id", (req, res, next) => {
  if (isDBConnected()) return next();
  return demo.demoGetProductById(req, res);
});

app.post("/api/products", universalProtect, universalAdmin, (req, res, next) => {
  if (isDBConnected()) return next();
  return demo.demoCreateProduct(req, res);
});

app.put("/api/products/:id", universalProtect, universalAdmin, (req, res, next) => {
  if (isDBConnected()) return next();
  return demo.demoUpdateProduct(req, res);
});

app.delete("/api/products/:id", universalProtect, universalAdmin, (req, res, next) => {
  if (isDBConnected()) return next();
  return demo.demoDeleteProduct(req, res);
});

app.use("/api/products", productRoutes);

// ── CATEGORY Routes ────────────────────────────────────────────────────────────
app.get("/api/categories", (req, res, next) => {
  if (isDBConnected()) return next();
  return demo.demoGetCategories(req, res);
});

app.post("/api/categories", universalProtect, universalAdmin, (req, res, next) => {
  if (isDBConnected()) return next();
  return demo.demoCreateCategory(req, res);
});

app.delete("/api/categories/:id", universalProtect, universalAdmin, (req, res, next) => {
  if (isDBConnected()) return next();
  return demo.demoDeleteCategory(req, res);
});

app.use("/api/categories", categoryRoutes);

// ── ORDER Routes ───────────────────────────────────────────────────────────────
app.get("/api/orders", universalProtect, universalAdmin, (req, res, next) => {
  if (isDBConnected()) return next();
  return demo.demoGetOrders(req, res);
});

app.get("/api/orders/myorders", universalProtect, (req, res, next) => {
  if (isDBConnected()) return next();
  // Demo: return orders belonging to logged-in user
  const { DEMO_ORDERS } = require("./controllers/demoController");
  const userOrders = demo.DEMO_ORDERS ? demo.DEMO_ORDERS.filter(o => o.user._id === req.user._id) : [];
  return res.json(userOrders);
});

app.get("/api/orders/:id", universalProtect, (req, res, next) => {
  if (isDBConnected()) return next();
  const order = demo.DEMO_ORDERS ? demo.DEMO_ORDERS.find(o => o._id === req.params.id) : null;
  if (!order) return res.status(404).json({ message: "Order not found" });
  return res.json(order);
});

app.put("/api/orders/:id/pay", universalProtect, (req, res, next) => {
  if (isDBConnected()) return next();
  // Demo: just return success
  return res.json({ message: "Order marked as paid (demo)", isPaid: true, paidAt: new Date() });
});

app.post("/api/orders", universalProtect, (req, res, next) => {
  if (isDBConnected()) return next();
  return demo.demoCreateOrder(req, res);
});

app.use("/api/orders", orderRoutes);

// ── OFFER Routes ──────────────────────────────────────────────────────────────
app.get("/api/offers", (req, res, next) => {
  if (isDBConnected()) return next();
  const now = new Date();
  return res.json(
    DEMO_OFFERS.filter((offer) => {
      const startDate = new Date(offer.startDate);
      const endDate = new Date(offer.endDate);
      return offer.enabled && offer.status === "active" && startDate <= now && endDate >= now;
    }).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
  );
});

app.get("/api/offers/admin", universalProtect, universalAdmin, (req, res, next) => {
  if (isDBConnected()) return next();
  return res.json([...DEMO_OFFERS].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
});

app.post("/api/offers/admin", universalProtect, universalAdmin, (req, res, next) => {
  if (isDBConnected()) return next();
  const id = `offer_${Date.now()}`;
  const offer = {
    ...req.body,
    _id: id,
    id,
    enabled: req.body.enabled !== false,
    status: req.body.status || "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  DEMO_OFFERS.unshift(offer);
  return res.status(201).json(offer);
});

app.put("/api/offers/admin/:id", universalProtect, universalAdmin, (req, res, next) => {
  if (isDBConnected()) return next();
  const index = DEMO_OFFERS.findIndex((offer) => offer._id === req.params.id || offer.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Offer not found" });
  DEMO_OFFERS[index] = { ...DEMO_OFFERS[index], ...req.body, updatedAt: new Date() };
  return res.json(DEMO_OFFERS[index]);
});

app.put("/api/offers/admin/:id/toggle", universalProtect, universalAdmin, (req, res, next) => {
  if (isDBConnected()) return next();
  const offer = DEMO_OFFERS.find((item) => item._id === req.params.id || item.id === req.params.id);
  if (!offer) return res.status(404).json({ message: "Offer not found" });
  offer.enabled = req.body.enabled !== undefined ? req.body.enabled : !offer.enabled;
  offer.status = offer.enabled ? "active" : "hidden";
  offer.updatedAt = new Date();
  return res.json(offer);
});

app.delete("/api/offers/admin/:id", universalProtect, universalAdmin, (req, res, next) => {
  if (isDBConnected()) return next();
  const index = DEMO_OFFERS.findIndex((offer) => offer._id === req.params.id || offer.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Offer not found" });
  DEMO_OFFERS.splice(index, 1);
  return res.json({ message: "Offer deleted" });
});

app.use("/api/offers", offerRoutes);

// ── HOMEPAGE CONTENT Routes ──────────────────────────────────────────────────
app.get("/api/home-content", (req, res, next) => {
  if (isDBConnected()) return next();
  return res.json(DEMO_HOME_CONTENT);
});

app.put("/api/home-content", universalProtect, universalAdmin, (req, res, next) => {
  if (isDBConnected()) return next();
  DEMO_HOME_CONTENT = {
    ...DEMO_HOME_CONTENT,
    ...req.body,
    updatedAt: new Date(),
  };
  return res.json(DEMO_HOME_CONTENT);
});

app.use("/api/home-content", homeContentRoutes);

// ── REPORT Routes ──────────────────────────────────────────────────────────────
app.get("/api/reports/dashboard", universalProtect, universalAdmin, (req, res, next) => {
  if (isDBConnected()) return next();
  return demo.demoDashboardStats(req, res);
});

app.use("/api/reports", reportRoutes);

// ── UPLOAD Routes ──────────────────────────────────────────────────────────────
app.post("/api/upload", universalProtect, universalAdmin, (req, res, next) => {
  if (isDBConnected()) return next();
  return demo.demoUpload(req, res);
});

app.use("/api/upload", uploadRoutes);

// ── Static Uploads ────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ── Status Endpoint ───────────────────────────────────────────────────────────
app.get("/api/status", (req, res) => {
  res.json({
    db: isDBConnected() ? "connected" : "demo_mode",
    message: isDBConnected()
      ? "Connected to MongoDB"
      : "Running in DEMO MODE",
    demoCredentials: isDBConnected()
      ? null
      : {
          admin:    { email: "admin@grocery.com",    password: "Admin@123"    },
          customer: { email: "customer@gmail.com",   password: "Customer@123" },
        },
  });
});

// ── Root ──────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send(`🚀 Saumya Stores API [${isDBConnected() ? "Live" : "Demo"} Mode]`);
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  if (!isDBConnected()) {
    console.log("ℹ️  Demo mode — Login: admin@grocery.com / Admin@123  |  customer@gmail.com / Customer@123");
  }
});
