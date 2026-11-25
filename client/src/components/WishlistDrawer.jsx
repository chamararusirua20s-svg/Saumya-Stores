import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { AuthModalContext } from "../context/AuthModalContext";
import toast from "react-hot-toast";

const WishlistDrawer = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, isWishlistOpen, setIsWishlistOpen } =
    useContext(WishlistContext);
  const { addToCart, setIsCartDrawerOpen } = useContext(CartContext);
  const { requireAuth } = useContext(AuthModalContext);
  const navigate = useNavigate();

  if (!isWishlistOpen) return null;

  const handleMoveToCart = (item) => {
    requireAuth(() => {
      try {
        addToCart(item, 1, null, false);
        removeFromWishlist(item._id);
        toast.success(`${item.name} moved to cart!`);
      } catch {
        navigate(`/product/${item._id}`);
        setIsWishlistOpen(false);
      }
    }, "/cart");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#F8FAF5]">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-red-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg tracking-tight">My Wishlist</h3>
                <p className="text-xs text-gray-500 font-medium">
                  {wishlistItems.length} {wishlistItems.length === 1 ? "saved item" : "saved items"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-gray-100">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                <div className="w-20 h-20 rounded-full bg-red-50 text-red-400 flex items-center justify-center">
                  <Heart className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-lg">Your wishlist is empty</h4>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Save your favorite fruits, veggies, and groceries by tapping the heart icon on any product.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsWishlistOpen(false);
                    navigate("/shop");
                  }}
                  className="btn btn-primary text-sm px-6 py-2.5 mt-2"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <div key={item._id} className="pt-4 first:pt-0 flex gap-3.5 items-center">
                  <Link
                    to={`/product/${item._id}`}
                    onClick={() => setIsWishlistOpen(false)}
                    className="w-[72px] h-[72px] rounded-xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0 overflow-hidden flex items-center justify-center hover:opacity-90"
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item._id}`}
                      onClick={() => setIsWishlistOpen(false)}
                      className="font-bold text-sm text-gray-900 hover:text-[#16A34A] transition-colors truncate block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                      {item.brand || item.category?.name || "Grocery"}
                    </p>
                    <p className="text-xs font-black text-[#16A34A] mt-1">
                      Rs. {Number(item.price || 0).toFixed(2)}
                    </p>

                    <div className="flex items-center justify-between mt-2.5">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="btn btn-primary text-[11px] py-1.5 px-3 rounded-lg flex items-center space-x-1"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>

                      <button
                        onClick={() => removeFromWishlist(item._id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistItems.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between">
              <button
                onClick={clearWishlist}
                className="text-xs font-bold text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  requireAuth(() => setIsCartDrawerOpen(true), "/cart");
                }}
                className="text-xs font-bold text-[#16A34A] hover:underline flex items-center space-x-1"
              >
                <span>View Cart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;
