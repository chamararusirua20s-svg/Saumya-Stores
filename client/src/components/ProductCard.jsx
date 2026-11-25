import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart, Plus, Minus, Check, Eye } from "lucide-react";
import toast from "react-hot-toast";
import {
  getPriceRange,
  getProductVariants,
  getTotalVariantStock,
  getCartItemId,
} from "../utils/productVariants";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthModalContext } from "../context/AuthModalContext";

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, updateQuantity, setIsCartDrawerOpen } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { requireAuth } = useContext(AuthModalContext);
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const discount = product.discount || 0;
  const variants = getProductVariants(product);
  const totalStock = getTotalVariantStock(product);
  const priceRange = getPriceRange(product);
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= (product.stockLevel || 10);
  const hasMultipleSizes = variants.length > 1;

  // Selected or default variant
  const defaultVariant = variants[0];
  const cartItemId = getCartItemId(product._id, defaultVariant._id);
  const cartItem = cartItems.find((item) => item.cartItemId === cartItemId || item.product === product._id);
  const quantityInCart = cartItem ? cartItem.qty : 0;

  const inWishlist = isInWishlist(product._id);

  // Original and discounted prices for single variant
  const originalPrice = defaultVariant.sellingPrice;
  const finalPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error("This product is currently out of stock.");
      return;
    }

    if (hasMultipleSizes) {
      // If multiple variants exist, open product page for size selection
      toast("Please select your preferred size/weight", { icon: "⚖️" });
      return;
    }

    requireAuth(() => {
      try {
        addToCart(product, 1, defaultVariant, false);
        toast.success(`${product.name} added to cart!`, {
          icon: "🛒",
          id: `cart-${product._id}`,
        });
      } catch (err) {
        toast.error(err.message || "Failed to add to cart");
      }
    }, `/product/${product._id}`);
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    requireAuth(() => {
      if (quantityInCart >= totalStock) {
        toast.error(`Only ${totalStock} available in stock`);
        return;
      }
      updateQuantity(cartItem.cartItemId || cartItem.product, quantityInCart + 1);
    }, "/cart");
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(cartItem.cartItemId || cartItem.product, quantityInCart - 1);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-100 hover:border-emerald-500/30 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative"
    >
      {/* ── Image & Badges Container ── */}
      <div className="relative overflow-hidden aspect-square bg-[#F8FAF5] flex items-center justify-center p-4">
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1.5 z-20 items-start">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm tracking-wide">
              {discount}% OFF
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Only {totalStock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Out of stock
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-sm z-20 transition-all duration-200 ${
            inWishlist
              ? "bg-red-50 text-red-500 hover:bg-red-100"
              : "bg-white/90 hover:bg-white text-gray-400 hover:text-red-500"
          }`}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500" : ""}`} />
        </button>

        {/* Product Image */}
        <Link to={`/product/${product._id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80"}
            alt={product.name}
            className={`max-h-full max-w-full object-contain transition-transform duration-500 ${
              isHovered ? "scale-108" : "scale-100"
            } ${isOutOfStock ? "opacity-60 grayscale-[40%]" : ""}`}
            loading="lazy"
          />
        </Link>

        {/* Quick Action Overlay on Hover */}
        <div
          className={`absolute inset-0 bg-black/25 backdrop-blur-[1px] transition-opacity duration-200 flex items-center justify-center space-x-2 z-10 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Link
            to={`/product/${product._id}`}
            className="p-2.5 bg-white text-gray-800 rounded-full shadow-lg hover:bg-[#16A34A] hover:text-white transition-all transform hover:scale-110"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => {
              if (hasMultipleSizes) {
                // Navigate to product for size selection
              } else {
                requireAuth(() => {
                  addToCart(product, 1, defaultVariant, true);
                }, `/product/${product._id}`);
              }
            }}
            className="p-2.5 bg-[#16A34A] text-white rounded-full shadow-lg hover:bg-[#14532D] transition-all transform hover:scale-110"
            title="Quick View in Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div className="space-y-1.5">
          {/* Category & Unit */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400">
            <span className="text-[#16A34A] font-bold uppercase tracking-wider truncate max-w-[120px]">
              {product.category?.name || "Grocery"}
            </span>
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium text-[10px]">
              {defaultVariant.name !== "Default" ? defaultVariant.name : (product.brand || "Fresh")}
            </span>
          </div>

          {/* Product Name */}
          <Link to={`/product/${product._id}`} className="block group-hover:text-[#16A34A] transition-colors">
            <h3 className="text-gray-900 font-bold text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Ratings */}
          <div className="flex items-center space-x-1 pt-0.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.averageRating || 5)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-bold ml-1">
              ({product.numReviews || 8})
            </span>
          </div>
        </div>

        {/* ── Pricing and Action Row ── */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-end justify-between gap-2">
            {/* Price in Sri Lankan Rupees */}
            <div className="flex flex-col min-w-0">
              {discount > 0 && (
                <span className="text-xs text-gray-400 line-through font-medium leading-none mb-1">
                  Rs. {originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-base sm:text-lg font-black text-gray-900 tracking-tight leading-none text-[#14532D]">
                {hasMultipleSizes
                  ? priceRange.same
                    ? `Rs. ${priceRange.min.toFixed(2)}`
                    : `Rs. ${priceRange.min.toFixed(0)} - ${priceRange.max.toFixed(0)}`
                  : `Rs. ${finalPrice.toFixed(2)}`}
              </span>
            </div>

            {/* Add to Cart or Inline Counter Button */}
            {isOutOfStock ? (
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">
                Sold Out
              </span>
            ) : hasMultipleSizes ? (
              <Link
                to={`/product/${product._id}`}
                className="btn btn-outline text-xs py-1.5 px-3 rounded-xl font-bold flex items-center space-x-1"
              >
                <span>Options</span>
              </Link>
            ) : quantityInCart > 0 ? (
              /* Inline Quantity Counter */
              <div className="flex items-center bg-[#16A34A] text-white rounded-xl shadow-xs overflow-hidden">
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 flex items-center justify-center hover:bg-[#15803d] transition-colors"
                  title="Reduce quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-black">
                  {quantityInCart}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={quantityInCart >= totalStock}
                  className="w-7 h-7 flex items-center justify-center hover:bg-[#15803d] transition-colors disabled:opacity-40"
                  title="Add more"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Add to Cart Button */
              <button
                onClick={handleQuickAdd}
                className="btn btn-primary text-xs py-2 px-3 sm:px-3.5 rounded-xl font-bold flex items-center space-x-1 shadow-xs hover:shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
