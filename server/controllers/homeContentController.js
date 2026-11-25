const HomeContent = require("../models/HomeContent");

const defaultHomeContent = {
  singleton: "homepage",
  heroSlides: [
    {
      title: "Fresh Vegetables",
      subtitle: "Farm Fresh Every Day",
      badge: "Premium Quality",
      offer: "Up to 30% OFF",
      bg: "vegetables_slide",
      link: "/shop?category=vegetables",
      active: true,
      displayOrder: 1,
    },
    {
      title: "Fresh Fruits",
      subtitle: "Healthy Life Starts Here",
      badge: "100% Organic",
      offer: "Buy 2 Get 1 Free",
      bg: "fruits_slide",
      link: "/shop?category=fruits",
      active: true,
      displayOrder: 2,
    },
    {
      title: "Daily Grocery Deals",
      subtitle: "Everything You Need",
      badge: "Super Savings",
      offer: "Special Weekend Offers",
      bg: "supermarket_slide",
      link: "/shop",
      active: true,
      displayOrder: 3,
    },
  ],
  promotionalBanners: [
    {
      title: "Super Saver Deals",
      description: "Get flat Rs. 500 discount on your order of Rs. 5000+! Use coupon: SAVER500",
      active: true,
      bgGradient: "from-amber-500 to-orange-600",
      displayOrder: 1,
    },
  ],
  homepageCategories: [
    "Vegetables",
    "Fruits",
    "Dairy",
    "Bakery",
    "Beverages",
    "Frozen Foods",
    "Household Items",
  ],
  featuredSections: [
    {
      key: "featured",
      title: "Featured Products",
      subtitle: "Top Saver Deals & Handpicked Items",
      active: true,
      displayOrder: 1,
    },
    {
      key: "vegetables",
      title: "Vegetables",
      subtitle: "Farm Fresh Organic Greens",
      active: true,
      displayOrder: 2,
    },
    {
      key: "fruits",
      title: "Fruits",
      subtitle: "Sweet and Juicy Seasonal Harvest",
      active: true,
      displayOrder: 3,
    },
    {
      key: "dailyEssentials",
      title: "Daily Essentials",
      subtitle: "Dairy, Bakery, & Staples",
      active: true,
      displayOrder: 4,
    },
    {
      key: "bestSelling",
      title: "Best Selling Products",
      subtitle: "Customer Favorites & Highly Rated Staples",
      active: true,
      displayOrder: 5,
    },
    {
      key: "recentlyAdded",
      title: "Recently Added Products",
      subtitle: "Latest Arrivals to our Supermarket Shelves",
      active: true,
      displayOrder: 6,
    },
    {
      key: "recommended",
      title: "Recommended Products",
      subtitle: "Curated Snacks & Household Goods For You",
      active: true,
      displayOrder: 7,
    },
  ],
};

const ensureHomeContent = async () => {
  let content = await HomeContent.findOne({ singleton: "homepage" });
  if (!content) {
    content = await HomeContent.create(defaultHomeContent);
  }
  return content;
};

const getHomeContent = async (req, res) => {
  const content = await ensureHomeContent();
  res.json(content);
};

const updateHomeContent = async (req, res) => {
  const content = await ensureHomeContent();

  content.heroSlides = Array.isArray(req.body.heroSlides)
    ? req.body.heroSlides
    : content.heroSlides;
  content.promotionalBanners = Array.isArray(req.body.promotionalBanners)
    ? req.body.promotionalBanners
    : content.promotionalBanners;
  content.homepageCategories = Array.isArray(req.body.homepageCategories)
    ? req.body.homepageCategories
    : content.homepageCategories;
  content.featuredSections = Array.isArray(req.body.featuredSections)
    ? req.body.featuredSections
    : content.featuredSections;

  const updatedContent = await content.save();
  res.json(updatedContent);
};

module.exports = {
  defaultHomeContent,
  getHomeContent,
  updateHomeContent,
};
