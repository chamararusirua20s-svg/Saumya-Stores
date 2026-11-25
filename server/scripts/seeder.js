const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const connectDB = require("../config/db");
const { categories, products, users } = require("../utils/sampleData");

dotenv.config();

const importData = async () => {
  try {
    // 1. Establish database connection
    let uri = process.env.MONGO_URI;
    if (!uri || uri.includes("<username>") || uri.includes("<cluster>")) {
      uri = "mongodb://127.0.0.1:27017/saumya-stores";
    }
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB for seeding...");

    // 2. Clear existing collections
    await Category.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log("🗑️  Cleared existing database records.");

    // 3. Seed Categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`📦 Seeded ${createdCategories.length} categories.`);

    // 4. Seed Users one-by-one so pre-save password hashing runs on each doc
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`👤 Seeded ${createdUsers.length} users.`);

    const adminUser = createdUsers.find(u => u.role === "admin");
    const adminId = adminUser ? adminUser._id : null;

    // 5. Seed Products with correct category ObjectIds and admin creator ID
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    const productsToInsert = products.map(prod => {
      const categoryId = categoryMap[prod.categoryName];
      if (!categoryId) {
        console.warn(`⚠️  Category not found for product: ${prod.name} (${prod.categoryName})`);
      }
      return {
        name: prod.name,
        barcode: prod.barcode,
        brand: prod.brand,
        description: prod.description,
        buyingPrice: prod.buyingPrice,
        sellingPrice: prod.sellingPrice,
        quantity: prod.quantity,
        stockLevel: prod.stockLevel,
        image: prod.image,
        category: categoryId,
        user: adminId
      };
    });

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`🛒 Seeded ${createdProducts.length} products.`);

    console.log("🌟 Seeding Completed Successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed with error: ${error.message}`);
    process.exit(1);
  }
};

importData();
