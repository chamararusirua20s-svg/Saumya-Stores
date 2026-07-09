const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Category = require("../models/Category");

// @desc    Get dashboard statistics
// @route   GET /api/reports/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
    
    const allOrders = await Order.find({ isPaid: true });
    const totalRevenue = allOrders.reduce((acc, order) => acc + order.totalPrice, 0);
    
    const inventoryProducts = await Product.find({});
    const getStocks = (product) =>
      product.variants?.length
        ? product.variants.map((variant) => Number(variant.stock) || 0)
        : [Number(product.quantity) || 0];

    const lowStockProducts = inventoryProducts.filter((product) =>
      getStocks(product).some(
        (stock) => stock > 0 && stock <= (Number(product.stockLevel) || 0)
      )
    );

    const outOfStockProducts = inventoryProducts.filter((product) =>
      getStocks(product).some((stock) => stock === 0)
    );

    // Weekly sales (last 7 days breakdown)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklySales = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalProducts,
      totalCategories,
      totalCustomers,
      todayOrders,
      totalRevenue,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      weeklySales
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
