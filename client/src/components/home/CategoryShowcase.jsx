import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CATEGORY_DEFAULT_IMAGES = {
  "Vegetables": "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=300&q=80",
  "Fruits": "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=300&q=80",
  "Dairy": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80",
  "Bakery": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80",
  "Beverages": "https://images.unsplash.com/photo-1527960650-2652a92c6df0?w=300&q=80",
  "Rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80",
  "Grocery": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80",
  "Snacks": "https://images.unsplash.com/photo-1599490659273-e3b6900ee3cd?w=300&q=80",
  "Frozen Foods": "https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=300&q=80",
  "Household Items": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&q=80",
  "Personal Care": "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300&q=80",
};

const CATEGORY_TAGLINES = {
  "Vegetables": "Farm fresh & organic",
  "Fruits": "Juicy & sweet",
  "Dairy": "Fresh milk & cheeses",
  "Bakery": "Oven fresh breads",
  "Beverages": "Cool juices & drinks",
  "Rice": "Keeri Samba & Basmati",
  "Grocery": "Spices, oils & pantry",
  "Snacks": "Biscuits & chocolates",
  "Frozen Foods": "Meats & desserts",
  "Household Items": "Cleaners & care",
  "Personal Care": "Soaps & hygiene",
};

const CategoryShowcase = ({ categories = [], loading = false }) => {
  if (loading) {
    return (
      <section className="container-custom py-10 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 skeleton-box rounded-xl"></div>
          <div className="h-6 w-24 skeleton-box rounded-xl"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-box rounded-2xl h-44 w-full"></div>
          ))}
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <section className="container-custom py-10 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100/70 text-[#14532D] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Curated Departments</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Browse our wide selection of farm-fresh groceries and pantry essentials
          </p>
        </div>

        <Link
          to="/shop"
          className="text-[#16A34A] hover:text-[#14532D] font-bold text-sm flex items-center space-x-1 transition-colors mt-3 sm:mt-0"
        >
          <span>View All Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4.5">
        {categories.map((cat) => {
          const imgUrl = cat.image && !cat.image.includes("via.placeholder.com")
            ? cat.image
            : CATEGORY_DEFAULT_IMAGES[cat.name] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80";

          const tagline = CATEGORY_TAGLINES[cat.name] || "Fresh grocery essentials";

          return (
            <Link
              key={cat._id}
              to={`/shop?category=${cat._id}`}
              className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-100 hover:border-emerald-500/30 p-3.5 sm:p-4 text-center transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1.5 flex flex-col items-center justify-between"
            >
              {/* Category Image Circle */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#F8FAF5] p-1.5 mb-3 group-hover:scale-108 transition-transform duration-300 shadow-inner">
                <img
                  src={imgUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              </div>

              {/* Title & Tagline */}
              <div className="w-full">
                <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 group-hover:text-[#16A34A] transition-colors truncate">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">
                  {tagline}
                </p>
              </div>

              {/* Explore Chip */}
              <span className="mt-2 text-[10px] font-bold text-[#16A34A] bg-emerald-50 group-hover:bg-[#16A34A] group-hover:text-white px-2.5 py-0.5 rounded-full transition-colors">
                Explore →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryShowcase;
