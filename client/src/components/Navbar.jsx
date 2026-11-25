import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import {
  ShoppingBag,
  User,
  Search,
  LogOut,
  Menu,
  X,
  Heart,
  MapPin,
  ChevronDown,
  Sparkles,
  Phone,
  Flame,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Store,
  UserPlus,
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { AuthModalContext } from "../context/AuthModalContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { LocationContext } from "../context/LocationContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const { user, logout } = useContext(AuthContext);
  const { requireAuth } = useContext(AuthModalContext);
  const { cartItems, cartTotal, totalItemsCount, setIsCartDrawerOpen } = useContext(CartContext);
  const { wishlistItems, setIsWishlistOpen } = useContext(WishlistContext);
  const { selectedLocation, fulfillmentType, setIsLocationModalOpen } = useContext(LocationContext);

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);

  // Fetch categories for search and category navigation
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await axios.get("/api/categories");
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCats();
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearchDropdown(false);
    setCategoriesDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Debounced live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        let url = `/api/products?keyword=${encodeURIComponent(searchQuery.trim())}`;
        const { data } = await axios.get(url);
        let products = data.products || [];
        if (searchCategory) {
          products = products.filter(
            (p) => p.category?._id === searchCategory || p.category === searchCategory
          );
        }
        setSearchResults(products.slice(0, 6));
        setShowSearchDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 280);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery, searchCategory]);

  // Handle clicking outside of search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim() && !searchCategory) return;
    setShowSearchDropdown(false);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append("keyword", searchQuery.trim());
    if (searchCategory) params.append("category", searchCategory);
    navigate(`/shop?${params.toString()}`);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      {/* ── Top Announcement & Delivery Bar ── */}
      <div className="bg-[#14532D] text-white text-xs py-2 px-4 border-b border-white/10 hidden sm:block">
        <div className="container-custom flex items-center justify-between">
          {/* Location & Delivery Mode */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center space-x-1.5 text-emerald-300 hover:text-white transition-colors py-0.5 px-2 rounded-lg bg-white/10 hover:bg-white/15"
              title="Change Delivery Location"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Deliver to:</span>
              <strong className="text-white underline decoration-amber-400 underline-offset-2">
                {selectedLocation.city}
              </strong>
              <span className="text-[10px] text-emerald-200">
                ({fulfillmentType === "pickup" ? "Store Pickup" : selectedLocation.eta})
              </span>
              <ChevronDown className="w-3 h-3 text-emerald-300" />
            </button>

            <span className="text-white/30">|</span>

            <div className="flex items-center space-x-1.5 text-white/90">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Free Delivery on orders over <strong className="text-amber-300 font-bold">Rs. 5,000</strong>
              </span>
            </div>
          </div>

          {/* Contact & Store Hours */}
          <div className="flex items-center space-x-4 text-white/80">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-emerald-300" />
              <span>Open: 7:00 AM - 10:00 PM Daily</span>
            </div>
            <span className="text-white/30">|</span>
            <a
              href="tel:+94772434641"
              className="flex items-center space-x-1 text-emerald-200 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+94 77 2434 641</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Header Row ── */}
      <div className="container-custom py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <BrandLogo size="header" />

          {/* Large Intelligent Search Bar */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl relative mx-2">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full flex items-center bg-[#F8FAF5] rounded-2xl border border-gray-200/90 focus-within:border-[#16A34A] focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all overflow-hidden shadow-xs"
            >
              {/* Category Filter Select within Search */}
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-600 pl-3 pr-2 py-3 border-r border-gray-200 focus:outline-none cursor-pointer max-w-[130px] truncate"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Keyword Input */}
              <input
                type="text"
                placeholder="Search fresh vegetables, fruits, rice, dairy, daily essentials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                className="flex-1 bg-transparent px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1.5 text-gray-400 hover:text-gray-600 mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Search Submit Button */}
              <button
                type="submit"
                className="bg-[#16A34A] hover:bg-[#15803d] text-white px-5 py-3 transition-colors flex items-center justify-center font-bold text-sm"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Live Search Results Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                {searchLoading ? (
                  <div className="p-4 text-center text-xs text-gray-500 flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-[#16A34A] border-t-transparent rounded-full animate-spin" />
                    <span>Searching products...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="p-3 hover:bg-[#F8FAF5] flex items-center gap-3 transition-colors"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-contain bg-gray-50 border border-gray-100 p-1 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-[10px] text-gray-500 font-medium">
                            {product.category?.name || "Grocery"} • {product.brand || "Saumya"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-[#16A34A] block">
                            Rs. {Number(product.sellingPrice || product.price || 0).toFixed(2)}
                          </span>
                          {product.discount > 0 && (
                            <span className="text-[9px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">
                              {product.discount}% OFF
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                    <div className="p-2.5 bg-gray-50 text-center">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs font-bold text-[#16A34A] hover:underline"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-gray-500">
                    No matching products found for "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Actions (Wishlist, Cart, Account, Mobile toggle) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 rounded-xl text-gray-600 hover:text-[#16A34A] hover:bg-emerald-50/60 transition-colors"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => requireAuth(() => setIsCartDrawerOpen(true), "/cart")}
              className="relative flex items-center space-x-2 p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-50 text-[#14532D] hover:bg-emerald-100/80 transition-all border border-emerald-200/60"
              title="View Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#16A34A]" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#16A34A] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {totalItemsCount > 99 ? "99+" : totalItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col text-left leading-none pl-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase">My Cart</span>
                <span className="text-xs font-black text-[#14532D] mt-0.5">
                  Rs. {cartTotal.toFixed(2)}
                </span>
              </div>
            </button>

            {/* User Account / Auth */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 py-1.5 px-3 rounded-xl hover:bg-gray-100 transition-colors text-sm font-semibold text-gray-700"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline font-bold text-gray-800 text-xs">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in text-xs font-semibold">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-gray-400 text-[10px] uppercase font-bold">Signed in as</p>
                        <p className="font-bold text-gray-900 truncate">{user.name}</p>
                      </div>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-[#16A34A]"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/my-orders"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-[#16A34A]"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center space-x-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <Link
                    to="/login"
                    className="btn btn-outline text-xs py-2 px-3 font-bold flex items-center space-x-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary text-xs py-2 px-3 font-bold hidden sm:flex items-center space-x-1.5 shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center bg-[#F8FAF5] rounded-xl border border-gray-200 overflow-hidden px-3 py-2"
          >
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search fresh groceries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="text-gray-400 p-1">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* ── Secondary Category Navigation Bar (Desktop) ── */}
      <div className="hidden md:block bg-white border-t border-gray-100">
        <div className="container-custom flex items-center justify-between text-xs font-bold py-2">
          {/* Category Dropdown Trigger & Quick Category Links */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className="bg-[#16A34A] text-white px-4 py-2 rounded-xl flex items-center space-x-2 font-bold hover:bg-[#15803d] transition-colors shadow-xs"
              >
                <Menu className="w-4 h-4" />
                <span>All Categories</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>

              {/* Categories Mega Dropdown */}
              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-fade-in divide-y divide-gray-50">
                  <div className="px-3 pb-2 text-[10px] uppercase font-black tracking-wider text-gray-400">
                    Grocery Departments
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/shop?category=${cat._id}`}
                        onClick={() => setCategoriesDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-[#16A34A] transition-colors"
                      >
                        <span className="font-semibold text-xs">{cat.name}</span>
                        <span className="text-[10px] text-gray-400 font-normal">Browse →</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <nav className="flex items-center space-x-5 text-gray-700 font-semibold">
              <Link to="/" className="hover:text-[#16A34A] transition-colors">
                Home
              </Link>
              <Link to="/shop" className="hover:text-[#16A34A] transition-colors">
                All Products
              </Link>
              <Link
                to="/shop?category=Vegetables"
                className="hover:text-[#16A34A] transition-colors flex items-center space-x-1"
              >
                <span>🥦 Fresh Vegetables</span>
              </Link>
              <Link
                to="/shop?category=Fruits"
                className="hover:text-[#16A34A] transition-colors flex items-center space-x-1"
              >
                <span>🍎 Fruits</span>
              </Link>
              <Link to="/shop?category=Dairy" className="hover:text-[#16A34A] transition-colors">
                🥛 Dairy
              </Link>
              <Link to="/shop?category=Bakery" className="hover:text-[#16A34A] transition-colors">
                🍞 Bakery
              </Link>
              <Link to="/shop?category=Rice" className="hover:text-[#16A34A] transition-colors">
                🌾 Rice & Grains
              </Link>
            </nav>
          </div>

          {/* Deals & Offers Badge */}
          <div className="flex items-center space-x-3">
            <Link
              to="/shop?deals=true"
              className="flex items-center space-x-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors border border-amber-200"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Special Offers & Discounts</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile Hamburger Drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-5 space-y-5 animate-fade-in shadow-xl">
          {/* Mobile Drawer Brand Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div onClick={() => setMobileMenuOpen(false)}>
              <BrandLogo size="sm" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
              Supermarket
            </span>
          </div>

          {/* Location button for mobile */}
          <button
            onClick={() => {
              setIsLocationModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 bg-emerald-50 rounded-xl text-xs font-bold text-emerald-900 border border-emerald-100"
          >
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#16A34A]" />
              <span>Deliver to: {selectedLocation.city}</span>
            </div>
            <span className="text-[#16A34A]">Change</span>
          </button>

          {/* Department List */}
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
              Explore Departments
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-[#F8FAF5] rounded-xl hover:bg-emerald-50"
              >
                🛒 All Products
              </Link>
              <Link
                to="/shop?deals=true"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-amber-50 text-amber-800 rounded-xl flex items-center space-x-1"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Special Offers</span>
              </Link>
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat._id}
                  to={`/shop?category=${cat._id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 bg-[#F8FAF5] rounded-xl hover:bg-emerald-50 text-gray-700 truncate"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Account links */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            {user ? (
              <div className="space-y-2 text-xs font-bold">
                <div className="text-gray-500">Hi, {user.name}</div>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2 text-gray-800 hover:text-[#16A34A]"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-2 text-gray-800 hover:text-[#16A34A]"
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 block p-2 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary text-xs py-2.5 text-center font-bold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary text-xs py-2.5 text-center font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
