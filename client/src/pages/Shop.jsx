import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import {
  Search,
  Filter,
  SlidersHorizontal,
  PackageSearch,
  X,
  RotateCcw,
  Flame,
  Check,
  ChevronRight,
  ArrowUpDown,
  Tag,
} from "lucide-react";
import { getTotalVariantStock } from "../utils/productVariants";

const Shop = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDeals, setOnlyDeals] = useState(false);
  const [priceRange, setPriceRange] = useState(10000);
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { search } = useLocation();
  const navigate = useNavigate();

  // Read URL query parameters on load or change
  useEffect(() => {
    const urlParams = new URLSearchParams(search);
    const queryCategory = urlParams.get("category");
    const queryKeyword = urlParams.get("keyword");
    const queryDeals = urlParams.get("deals");

    if (queryCategory) setSelectedCategory(queryCategory);
    if (queryKeyword) setKeyword(queryKeyword);
    if (queryDeals === "true") setOnlyDeals(true);

    fetchCategories();
    fetchAllProducts();
  }, [search]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/categories");
      setCategories(data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const { data: page1 } = await axios.get("/api/products?pageNumber=1");
      let prods = page1.products || [];
      const totalPages = page1.pages || 1;

      if (totalPages > 1) {
        const promises = [];
        for (let p = 2; p <= totalPages; p++) {
          promises.push(axios.get(`/api/products?pageNumber=${p}`));
        }
        const responses = await Promise.all(promises);
        responses.forEach((res) => {
          if (res.data?.products) {
            prods = [...prods, ...res.data.products];
          }
        });
      }

      setAllProducts(prods);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setLoading(false);
    }
  };

  // Derive all unique brands from loaded products
  const availableBrands = useMemo(() => {
    const brandSet = new Set();
    allProducts.forEach((p) => {
      if (p.brand && p.brand.trim()) brandSet.add(p.brand.trim());
    });
    return Array.from(brandSet).sort();
  }, [allProducts]);

  // Client-side filtering and sorting
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Keyword filter
        if (keyword.trim()) {
          const q = keyword.toLowerCase().trim();
          const matchName = p.name?.toLowerCase().includes(q);
          const matchBrand = p.brand?.toLowerCase().includes(q);
          const matchBarcode = p.barcode?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchCat = p.category?.name?.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchBarcode && !matchDesc && !matchCat) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory) {
          const catId = p.category?._id || p.category;
          const catName = p.category?.name || "";
          if (
            catId !== selectedCategory &&
            catName.toLowerCase() !== selectedCategory.toLowerCase()
          ) {
            return false;
          }
        }

        // Brand filter
        if (selectedBrand && p.brand !== selectedBrand) {
          return false;
        }

        // In Stock filter
        if (onlyInStock) {
          const stock = getTotalVariantStock(p);
          if (stock <= 0) return false;
        }

        // Deals filter
        if (onlyDeals && (!p.discount || p.discount <= 0)) {
          return false;
        }

        // Price range filter
        const price = Number(p.sellingPrice || p.price || 0);
        if (price > priceRange) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = Number(a.sellingPrice || a.price || 0);
        const priceB = Number(b.sellingPrice || b.price || 0);
        const discountA = Number(a.discount || 0);
        const discountB = Number(b.discount || 0);

        if (sortBy === "price-low") return priceA - priceB;
        if (sortBy === "price-high") return priceB - priceA;
        if (sortBy === "discount") return discountB - discountA;
        if (sortBy === "rating") return (b.averageRating || 0) - (a.averageRating || 0);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [
    allProducts,
    keyword,
    selectedCategory,
    selectedBrand,
    onlyInStock,
    onlyDeals,
    priceRange,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setKeyword("");
    setSelectedCategory("");
    setSelectedBrand("");
    setOnlyInStock(false);
    setOnlyDeals(false);
    setPriceRange(10000);
    setSortBy("newest");
    navigate("/shop", { replace: true });
  };

  const hasActiveFilters =
    Boolean(keyword) ||
    Boolean(selectedCategory) ||
    Boolean(selectedBrand) ||
    onlyInStock ||
    onlyDeals ||
    priceRange < 10000;

  // Selected category object
  const activeCategoryObj = categories.find(
    (c) => c._id === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="bg-[#F8FAF5] min-h-screen py-6 sm:py-10">
      <div className="container-custom space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500">
          <Link to="/" className="hover:text-[#16A34A] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="text-gray-900 font-bold">
            Supermarket Catalog
          </Link>
          {activeCategoryObj && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#16A34A] font-bold">{activeCategoryObj.name}</span>
            </>
          )}
        </div>

        {/* Catalog Banner */}
        <div className="bg-gradient-to-r from-[#14532D] to-[#16A34A] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-emerald-950/10">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-amber-300">
              Fresh Daily Harvest
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              {activeCategoryObj ? activeCategoryObj.name : "All Supermarket Products"}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Fresh vegetables, tropical fruits, keeri samba rice, dairy, and household goods at competitive Sri Lankan prices.
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
            <span className="block text-xs text-emerald-200 font-medium">Available Items</span>
            <span className="text-xl sm:text-2xl font-black text-white">{filteredProducts.length} Products</span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ── Left Sidebar Filters (Desktop) ── */}
          <aside className="hidden lg:block w-72 shrink-0 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-28">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-extrabold text-base text-gray-900 flex items-center space-x-2">
                <Filter className="w-4 h-4 text-[#16A34A]" />
                <span>Filters</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                Department
              </h4>
              <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    selectedCategory === ""
                      ? "bg-emerald-50 text-[#16A34A]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>All Categories</span>
                  {selectedCategory === "" && <Check className="w-3.5 h-3.5" />}
                </button>
                {categories.map((cat) => {
                  const isSelected =
                    selectedCategory === cat._id ||
                    selectedCategory.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <button
                      key={cat._id}
                      onClick={() => setSelectedCategory(cat._id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-emerald-50 text-[#16A34A]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Filter Toggles */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                Special Deals & Stock
              </h4>
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={onlyDeals}
                  onChange={(e) => setOnlyDeals(e.target.checked)}
                  className="rounded text-[#16A34A] focus:ring-[#16A34A] w-4 h-4"
                />
                <span className="flex items-center space-x-1 text-amber-700">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>On Discount / Offer</span>
                </span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-[#16A34A] focus:ring-[#16A34A] w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Price Slider */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase tracking-wider">Max Price</span>
                <span className="text-[#16A34A] font-black">Rs. {priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50"
                max="10000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#16A34A]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                <span>Rs. 50</span>
                <span>Rs. 10,000+</span>
              </div>
            </div>

            {/* Brand Filter */}
            {availableBrands.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                  Brands
                </h4>
                <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
                  <button
                    onClick={() => setSelectedBrand("")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedBrand === "" ? "bg-emerald-50 text-[#16A34A] font-bold" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    All Brands
                  </button>
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedBrand === brand
                          ? "bg-emerald-50 text-[#16A34A] font-bold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="truncate">{brand}</span>
                      {selectedBrand === brand && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* ── Products Section ── */}
          <div className="flex-1 w-full space-y-6">
            {/* Top Toolbar: Search Input + Sorting + Mobile Filter Trigger */}
            <div className="bg-white p-4 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search in Catalog */}
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Filter by name, brand, barcode..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="input pl-10 text-xs py-2.5"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {keyword && (
                  <button
                    onClick={() => setKeyword("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sorting & Mobile Filter Button */}
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden btn btn-secondary text-xs py-2 px-3 flex items-center space-x-1.5"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#16A34A]" />
                  <span>Filters</span>
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400 font-semibold hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#F8FAF5] border border-gray-200 text-xs font-bold text-gray-800 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#16A34A] cursor-pointer"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="discount">Biggest Discount</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters Pill Bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold text-gray-400">Active filters:</span>
                {keyword && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-800 shadow-xs">
                    "{keyword}"
                    <button onClick={() => setKeyword("")} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-[#16A34A] shadow-xs">
                    {activeCategoryObj?.name || "Category"}
                    <button onClick={() => setSelectedCategory("")} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrand && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-800 shadow-xs">
                    Brand: {selectedBrand}
                    <button onClick={() => setSelectedBrand("")} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {onlyDeals && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-700 shadow-xs">
                    🔥 Discounts Only
                    <button onClick={() => setOnlyDeals(false)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {onlyInStock && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-800 shadow-xs">
                    In Stock Only
                    <button onClick={() => setOnlyInStock(false)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-red-500 hover:underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="skeleton-box rounded-3xl h-80 w-full"></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                  <PackageSearch className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">No matching products found</h3>
                  <p className="text-xs text-gray-500 max-w-sm">
                    We couldn't find any products matching your active filters. Try adjusting search keywords or price range.
                  </p>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="btn btn-primary text-xs py-2.5 px-6 font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Modal/Drawer ── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-extrabold text-base text-gray-900">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-gray-400">Department</h4>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs font-bold ${
                      selectedCategory === "" ? "bg-emerald-50 text-[#16A34A]" : "text-gray-700"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        setSelectedCategory(cat._id);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs font-bold ${
                        selectedCategory === cat._id ? "bg-emerald-50 text-[#16A34A]" : "text-gray-700"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-3 border-t">
                <label className="flex items-center space-x-2 text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={onlyDeals}
                    onChange={(e) => setOnlyDeals(e.target.checked)}
                    className="rounded text-[#16A34A]"
                  />
                  <span>Special Offers Only</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded text-[#16A34A]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="btn btn-primary w-full py-3 text-xs font-bold"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="btn btn-secondary w-full py-2.5 text-xs font-bold"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
