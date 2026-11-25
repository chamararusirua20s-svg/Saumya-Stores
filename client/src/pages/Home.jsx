import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Sparkles, Flame, Tag, ShieldCheck, Truck, ShoppingBag } from "lucide-react";

// Import components
import HeroCarousel from "../components/HeroCarousel";
import DiscountSlider from "../components/home/DiscountSlider";
import TodaysOffers from "../components/home/TodaysOffers";
import CategoryShowcase from "../components/home/CategoryShowcase";
import WhyShopWithUs from "../components/home/WhyShopWithUs";
import ProductSlider from "../components/home/ProductSlider";
import Testimonials from "../components/home/Testimonials";
import PopularBrands from "../components/home/PopularBrands";
import { DEFAULT_CONTENT, fetchHomepageContent } from "../utils/homeContentStorage";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [homeContent, setHomeContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch categories & custom home content in parallel
      const [{ data: catData }, contentData] = await Promise.all([
        axios.get("/api/categories"),
        fetchHomepageContent(),
      ]);
      setCategories(catData || []);
      setHomeContent(contentData || DEFAULT_CONTENT);

      // 2. Fetch page 1 of products
      const { data: page1Data } = await axios.get("/api/products?pageNumber=1");
      let compiledProducts = page1Data.products || [];
      const totalPages = page1Data.pages || 1;

      // 3. Fetch remaining pages in parallel to supply all homepage shelves
      if (totalPages > 1) {
        const promises = [];
        for (let p = 2; p <= Math.min(totalPages, 5); p++) {
          promises.push(axios.get(`/api/products?pageNumber=${p}`));
        }
        const responses = await Promise.all(promises);
        responses.forEach((res) => {
          if (res.data && res.data.products) {
            compiledProducts = [...compiledProducts, ...res.data.products];
          }
        });
      }

      setProducts(compiledProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching homepage product data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    window.addEventListener("homepage-content-updated", fetchAllData);
    return () => {
      window.removeEventListener("homepage-content-updated", fetchAllData);
    };
  }, []);

  // Filter products by category/type
  const dealsProducts = products.filter((p) => (p.discount || 0) > 0);
  const vegetableProducts = products.filter((p) => p.category?.name === "Vegetables");
  const fruitProducts = products.filter((p) => p.category?.name === "Fruits");
  const dailyEssentials = products.filter((p) =>
    ["Dairy", "Bakery", "Rice", "Grocery"].includes(p.category?.name)
  );
  const bestSellingProducts = products.slice(0, 8);
  const freshArrivals = [...products].reverse().slice(0, 8);
  const recommendedProducts = products.filter((p) =>
    ["Snacks", "Frozen Foods", "Personal Care", "Household Items"].includes(p.category?.name)
  );

  return (
    <div className="bg-[#F8FAF5] pb-20 space-y-6 sm:space-y-10 text-gray-800">
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      {/* 2. Scrolling Discount/Feature Ticker */}
      <DiscountSlider />

      {/* 3. Shop by Category Showcase */}
      <CategoryShowcase categories={categories} loading={loading} />

      {/* 4. Promotional Banners Grid */}
      <section className="container-custom py-2 sm:py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Banner 1: Farm Fresh Veggies */}
          <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-[#14532D] to-[#16A34A] text-white flex flex-col justify-between min-h-[220px] shadow-lg shadow-emerald-950/10 group">
            <div className="space-y-2 z-10">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2.5 py-1 rounded-full">
                100% Upcountry Fresh
              </span>
              <h3 className="text-xl sm:text-2xl font-black leading-tight">
                Fresh Farm Greens & Vegetables
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Picked early morning, delivered crisp to your home.
              </p>
            </div>
            <div className="pt-4 z-10">
              <Link
                to="/shop?category=Vegetables"
                className="inline-flex items-center space-x-2 bg-white text-[#14532D] hover:bg-amber-400 hover:text-gray-950 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <span>Shop Vegetables</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Banner 2: Rice & Staple Foods */}
          <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-amber-600 to-orange-500 text-white flex flex-col justify-between min-h-[220px] shadow-lg shadow-orange-950/10 group">
            <div className="space-y-2 z-10">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2.5 py-1 rounded-full">
                Daily Pantry Essentials
              </span>
              <h3 className="text-xl sm:text-2xl font-black leading-tight">
                Premium Samba & Basmati Rice
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                Top grade 5kg & 10kg bags at special supermarket rates.
              </p>
            </div>
            <div className="pt-4 z-10">
              <Link
                to="/shop?category=Rice"
                className="inline-flex items-center space-x-2 bg-white text-amber-900 hover:bg-black hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <span>Explore Rice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Banner 3: Dairy & Cool Delights */}
          <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-blue-700 to-sky-600 text-white flex flex-col justify-between min-h-[220px] shadow-lg shadow-blue-950/10 group">
            <div className="space-y-2 z-10">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2.5 py-1 rounded-full">
                Chilled & Creamy
              </span>
              <h3 className="text-xl sm:text-2xl font-black leading-tight">
                Fresh Dairy, Milk & Butter
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                Anchor, Kotmale, Pelwatte and Highland favorites.
              </p>
            </div>
            <div className="pt-4 z-10">
              <Link
                to="/shop?category=Dairy"
                className="inline-flex items-center space-x-2 bg-white text-blue-900 hover:bg-amber-400 hover:text-gray-950 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <span>Shop Dairy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Today's Special Offers (Countdown Timer Deals) */}
      <TodaysOffers />

      {/* 6. Today's Special Deals & Discounts Shelf */}
      {dealsProducts.length > 0 && (
        <section className="container-custom py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[11px] font-extrabold uppercase tracking-wider mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Super Savings</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Today's Special Deals
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                Up to 30% off on selected everyday supermarket groceries
              </p>
            </div>
            <Link
              to="/shop?deals=true"
              className="text-[#16A34A] hover:text-[#14532D] text-xs sm:text-sm font-bold flex items-center space-x-1"
            >
              <span>See All Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductSlider products={dealsProducts} loading={loading} />
        </section>
      )}

      {/* 7. Fresh Vegetables Shelf */}
      <section className="container-custom py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#16A34A] block mb-1">
              Direct from Farms
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              🥦 Fresh Farm Vegetables
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Crisp tomatoes, carrots, beans, potatoes and leafy greens
            </p>
          </div>
          <Link
            to="/shop?category=Vegetables"
            className="text-[#16A34A] hover:text-[#14532D] text-xs sm:text-sm font-bold flex items-center space-x-1"
          >
            <span>View All Vegetables</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductSlider products={vegetableProducts.length ? vegetableProducts : products.slice(0, 8)} loading={loading} />
      </section>

      {/* 8. Fresh Fruits Shelf */}
      <section className="container-custom py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 block mb-1">
              Sweet & Seasonal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              🍎 Fresh & Juicy Fruits
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Bananas, apples, papayas, oranges and tropical selections
            </p>
          </div>
          <Link
            to="/shop?category=Fruits"
            className="text-[#16A34A] hover:text-[#14532D] text-xs sm:text-sm font-bold flex items-center space-x-1"
          >
            <span>View All Fruits</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductSlider products={fruitProducts.length ? fruitProducts : products.slice(2, 10)} loading={loading} />
      </section>

      {/* 9. Best Selling Products Shelf */}
      <section className="container-custom py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 block mb-1">
              Customer Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              ⭐ Best Selling Groceries
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              The most loved pantry items ordered by our community
            </p>
          </div>
          <Link
            to="/shop"
            className="text-[#16A34A] hover:text-[#14532D] text-xs sm:text-sm font-bold flex items-center space-x-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductSlider products={bestSellingProducts} loading={loading} />
      </section>

      {/* 10. Popular Sri Lankan Brands Showcase */}
      <PopularBrands />

      {/* 11. Daily Essentials (Rice, Dairy, Bakery, Pantry) */}
      <section className="container-custom py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#16A34A] block mb-1">
              Daily Kitchen Needs
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              🌾 Rice, Dairy & Cooking Essentials
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Keep your kitchen stocked with staple rice, oils, milk and flour
            </p>
          </div>
          <Link
            to="/shop"
            className="text-[#16A34A] hover:text-[#14532D] text-xs sm:text-sm font-bold flex items-center space-x-1"
          >
            <span>View Pantry</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductSlider products={dailyEssentials.length ? dailyEssentials : products.slice(4, 12)} loading={loading} />
      </section>

      {/* 12. Fresh Arrivals Shelf */}
      <section className="container-custom py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 block mb-1">
              Just Restocked
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              ✨ Fresh Arrivals & New Items
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Check out the latest grocery additions to our shelves
            </p>
          </div>
          <Link
            to="/shop"
            className="text-[#16A34A] hover:text-[#14532D] text-xs sm:text-sm font-bold flex items-center space-x-1"
          >
            <span>Browse All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductSlider products={freshArrivals} loading={loading} />
      </section>

      {/* 13. Supermarket Trust Guarantees */}
      <WhyShopWithUs />

      {/* 14. Customer Testimonials */}
      <Testimonials />

      {/* 15. Newsletter & Deal Alerts Subscription */}
      <section className="container-custom py-8">
        <div className="bg-gradient-to-br from-[#14532D] to-[#16A34A] rounded-3xl p-8 sm:p-14 md:p-16 relative overflow-hidden text-center text-white shadow-xl shadow-emerald-950/15">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-amber-300">
              Supermarket Deal Alerts
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              Never Miss Weekend Fresh Grocery Discounts!
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Subscribe with your mobile or email to get instant alerts on fresh produce arrivals,
              price drops, and member-exclusive discount vouchers.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for subscribing to Saumya Stores Deal Alerts!");
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
            >
              <input
                type="text"
                placeholder="Enter your phone or email..."
                required
                className="w-full sm:w-80 px-5 py-3.5 rounded-2xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-white/25 shadow-md"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-gray-950 px-7 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                Get Deals
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
