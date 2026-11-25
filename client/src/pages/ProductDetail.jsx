import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Minus,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle2,
  ChevronRight,
  Store,
  Sparkles,
  Info,
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthModalContext } from "../context/AuthModalContext";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
import { getProductVariants, getVariantFinalPrice } from "../utils/productVariants";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartDrawerOpen } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { requireAuth } = useContext(AuthModalContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        const variants = getProductVariants(data);
        setProduct(data);
        setSelectedVariant(variants.length === 1 ? variants[0] : variants[0] || null);

        // Fetch related products from same category
        try {
          const { data: allProdsData } = await axios.get("/api/products");
          const allList = allProdsData.products || [];
          const related = allList
            .filter((p) => p._id !== id && (p.category?._id === data.category?._id || p.category?.name === data.category?.name))
            .slice(0, 4);
          setRelatedProducts(related);
        } catch {
          // ignore related error
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to load product:", error);
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setQty(1);
  };

  const handleAddToCart = (openDrawer = false) => {
    if (!selectedVariant) {
      toast.error("Please choose a size first.");
      return false;
    }

    if (selectedVariant.stock === 0) {
      toast.error("Selected size is out of stock.");
      return false;
    }

    return requireAuth(() => {
      addToCart(product, qty, selectedVariant, openDrawer);
      toast.success(`${product.name} (${selectedVariant.name}) added to cart!`, {
        icon: "🛒",
      });
    }, `/product/${id}`);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      toast.error("Please choose a size first.");
      return;
    }

    if (selectedVariant.stock === 0) {
      toast.error("Selected size is out of stock.");
      return;
    }

    requireAuth(() => {
      addToCart(product, qty, selectedVariant, false);
      navigate("/cart");
    }, `/product/${id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-16 animate-pulse space-y-8">
        <div className="h-6 w-48 bg-gray-200 rounded-lg"></div>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2 h-96 bg-gray-200 rounded-3xl"></div>
          <div className="lg:w-1/2 space-y-6">
            <div className="h-10 bg-gray-200 w-3/4 rounded-xl"></div>
            <div className="h-6 bg-gray-200 w-1/3 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <p className="text-gray-500 text-sm">The grocery product you are looking for may have been removed.</p>
        <Link to="/shop" className="btn btn-primary text-xs py-2.5 px-6">
          Back to Supermarket
        </Link>
      </div>
    );
  }

  const variants = getProductVariants(product);
  const totalStock = variants.reduce((total, variant) => total + variant.stock, 0);
  const selectedPrice = selectedVariant ? getVariantFinalPrice(selectedVariant, product.discount) : 0;
  const originalVariantPrice = selectedVariant ? selectedVariant.sellingPrice : 0;
  const savings = originalVariantPrice - selectedPrice;
  const canAddToCart = Boolean(selectedVariant) && selectedVariant.stock > 0;
  const inWishlist = isInWishlist(product._id);

  return (
    <div className="bg-[#F8FAF5] min-h-screen py-8 sm:py-12">
      <div className="container-custom space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500">
          <Link to="/" className="hover:text-[#16A34A] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-[#16A34A] transition-colors">
            Shop
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                to={`/shop?category=${product.category?._id || product.category?.name}`}
                className="hover:text-[#16A34A] transition-colors"
              >
                {product.category?.name || "Grocery"}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* ── Product Main Showcase ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          {/* Left: Product Image & Floating Badges */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-lg bg-[#F8FAF5] border border-gray-100 rounded-3xl p-8 flex items-center justify-center overflow-hidden group shadow-inner">
              {/* Badges */}
              <div className="absolute top-5 left-5 flex flex-col space-y-2 z-10">
                {product.discount > 0 && (
                  <span className="bg-red-500 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-md">
                    {product.discount}% OFF
                  </span>
                )}
                <span className="bg-emerald-600 text-white font-bold text-[10px] px-3 py-1 rounded-full shadow-xs">
                  100% Farm Fresh
                </span>
              </div>

              {/* Wishlist & Share Buttons */}
              <div className="absolute top-5 right-5 flex flex-col space-y-2.5 z-10">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-2xl shadow-sm transition-all duration-200 ${
                    inWishlist
                      ? "bg-red-50 text-red-500"
                      : "bg-white text-gray-400 hover:text-red-500 hover:bg-white"
                  }`}
                  title={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? "fill-red-500" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-white text-gray-400 hover:text-[#16A34A] rounded-2xl shadow-sm transition-colors"
                  title="Share product"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Large Product Image with Zoom */}
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[380px] max-w-full object-contain transition-transform duration-500 group-hover:scale-108"
              />
            </div>
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="w-full lg:w-1/2 space-y-6">
            {/* Header / Brand / Title */}
            <div className="space-y-2 border-b border-gray-100 pb-5">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-full">
                  {product.category?.name || "Supermarket Grocery"}
                </span>
                <span className="text-xs font-bold text-gray-400">
                  Brand: <strong className="text-gray-800">{product.brand || "Saumya Stores"}</strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Stock */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.averageRating || 5)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-gray-500 ml-1.5">
                    {product.averageRating || 5.0} ({product.numReviews || 12} reviews)
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <span
                  className={`text-xs font-black ${
                    totalStock > 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {totalStock > 0 ? `In Stock (${totalStock} available)` : "Currently Out of Stock"}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 bg-[#F8FAF5] rounded-3xl border border-gray-100 space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl sm:text-4xl font-black text-[#14532D]">
                  Rs. {selectedPrice.toFixed(2)}
                </span>
                {product.discount > 0 && selectedVariant && (
                  <span className="text-base text-gray-400 line-through font-semibold">
                    Rs. {originalVariantPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {product.discount > 0 && savings > 0 && (
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>You save Rs. {savings.toFixed(2)} ({product.discount}% OFF)</span>
                </div>
              )}
            </div>

            {/* Choose Size / Variant Pills */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Select Size / Quantity
                </h3>
                <span className="text-[11px] text-gray-400 font-semibold">
                  {variants.length} {variants.length === 1 ? "Option" : "Options"} Available
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {variants.map((v) => {
                  const isSelected = selectedVariant?._id === v._id;
                  const vPrice = getVariantFinalPrice(v, product.discount);
                  return (
                    <button
                      key={v._id}
                      type="button"
                      onClick={() => handleVariantSelect(v)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-[#16A34A] bg-emerald-50/60 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-gray-900 block truncate">
                          {v.name}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />}
                      </div>
                      <span className="text-xs font-black text-[#16A34A] mt-1 block">
                        Rs. {vPrice.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-gray-500">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-black text-gray-900">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(selectedVariant?.stock || 99, qty + 1))}
                    disabled={qty >= (selectedVariant?.stock || 99)}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  Subtotal: <strong className="text-gray-900">Rs. {(selectedPrice * qty).toFixed(2)}</strong>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleAddToCart(true)}
                  disabled={!canAddToCart}
                  className="btn btn-primary py-3.5 text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-700/20"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!canAddToCart}
                  className="btn btn-dark py-3.5 text-sm font-bold flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Trust Features Strip */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100 text-center">
              <div className="p-3 bg-emerald-50/60 rounded-2xl flex flex-col items-center space-y-1">
                <Truck className="w-5 h-5 text-[#16A34A]" />
                <span className="text-[10px] font-extrabold text-gray-800 uppercase tracking-tight">
                  Express Delivery
                </span>
                <span className="text-[9px] text-gray-500">Free over Rs. 5,000</span>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-2xl flex flex-col items-center space-y-1">
                <Store className="w-5 h-5 text-[#16A34A]" />
                <span className="text-[10px] font-extrabold text-gray-800 uppercase tracking-tight">
                  Store Pickup
                </span>
                <span className="text-[9px] text-gray-500">Free at Wellawaya</span>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-2xl flex flex-col items-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
                <span className="text-[10px] font-extrabold text-gray-800 uppercase tracking-tight">
                  Fresh Guarantee
                </span>
                <span className="text-[9px] text-gray-500">100% Quality Inspected</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Product Tabs (Description / Storage / Details) ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-4 border-b border-gray-100 pb-3">
            <button
              onClick={() => setActiveTab("description")}
              className={`text-sm font-extrabold pb-3 transition-colors relative ${
                activeTab === "description"
                  ? "text-[#16A34A] border-b-2 border-[#16A34A]"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              Description & Specifications
            </button>
            <button
              onClick={() => setActiveTab("quality")}
              className={`text-sm font-extrabold pb-3 transition-colors relative ${
                activeTab === "quality"
                  ? "text-[#16A34A] border-b-2 border-[#16A34A]"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              Storage & Freshness Advice
            </button>
          </div>

          {activeTab === "description" ? (
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>{product.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold">Barcode:</span>{" "}
                  <strong className="text-gray-800">{product.barcode || "N/A"}</strong>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold">Category:</span>{" "}
                  <strong className="text-gray-800">{product.category?.name || "Grocery"}</strong>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold">Brand:</span>{" "}
                  <strong className="text-gray-800">{product.brand || "Local Sri Lankan"}</strong>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold">Fulfillment:</span>{" "}
                  <strong className="text-gray-800">Direct From Saumya Stores Wellawaya</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>
                To maintain optimum freshness, store perishable produce like vegetables and dairy
                in the refrigerator at or below 4°C. Grains and rice should be kept in a cool,
                dry, and airtight container away from direct sunlight.
              </p>
              <p className="text-xs text-gray-400 font-medium">
                All fresh items are checked by our certified supermarket quality controllers before packing.
              </p>
            </div>
          )}
        </div>

        {/* ── Related Products Carousel/Grid ── */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Related Products
                </h3>
                <p className="text-xs text-gray-500">More fresh items in {product.category?.name || "Grocery"}</p>
              </div>
              <Link
                to={`/shop?category=${product.category?._id || product.category?.name}`}
                className="text-xs font-bold text-[#16A34A] hover:underline"
              >
                View Category →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
