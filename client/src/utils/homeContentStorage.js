import axios from "axios";
import vegetablesBg from "../assets/vegetables_slide.png";
import fruitsBg from "../assets/fruits_slide.png";
import supermarketBg from "../assets/supermarket_slide.png";
import { authHeaders } from "./auth";

const imageMap = {
  vegetables_slide: vegetablesBg,
  fruits_slide: fruitsBg,
  supermarket_slide: supermarketBg,
};

export const resolveHomepageImage = (src) => imageMap[src] || src;

export const DEFAULT_CONTENT = {
  heroSlides: [
    {
      id: "slide-1",
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
      id: "slide-2",
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
      id: "slide-3",
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
      id: "promo-1",
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

const normalizeContent = (content = {}) => ({
  ...DEFAULT_CONTENT,
  ...content,
  heroSlides: (content.heroSlides || DEFAULT_CONTENT.heroSlides)
    .map((slide, index) => ({
      ...slide,
      id: slide.id || slide._id || `slide-${index + 1}`,
      displayOrder: Number(slide.displayOrder) || index + 1,
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder),
  promotionalBanners: (content.promotionalBanners || DEFAULT_CONTENT.promotionalBanners)
    .map((banner, index) => ({
      ...banner,
      id: banner.id || banner._id || `promo-${index + 1}`,
      displayOrder: Number(banner.displayOrder) || index + 1,
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder),
  featuredSections: (content.featuredSections || DEFAULT_CONTENT.featuredSections)
    .map((section, index) => ({
      ...section,
      displayOrder: Number(section.displayOrder) || index + 1,
      active: section.active !== false,
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder),
});

export const getHomepageContent = () => DEFAULT_CONTENT;

export const fetchHomepageContent = async () => {
  try {
    const { data } = await axios.get("/api/home-content");
    return normalizeContent(data);
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    return DEFAULT_CONTENT;
  }
};

export const saveHomepageContent = async (content) => {
  const { data } = await axios.put("/api/home-content", content, authHeaders());
  window.dispatchEvent(new Event("homepage-content-updated"));
  return normalizeContent(data);
};
