import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Trash2, Plus, Minus, ArrowRight, Truck, ShieldCheck } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { AuthModalContext } from "../context/AuthModalContext";
import BrandLogo from "./BrandLogo";

const FREE_DELIVERY_THRESHOLD = 5000;

const CartDrawer = () => {
  const {
    cartItems,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    totalItemsCount,
  } = useContext(CartContext);
  const { requireAuth } = useContext(AuthModalContext);

  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const freeDeliveryRemaining = Math.max(0, FREE_DELIVERY_THRESHOLD - cartTotal);
  const freeDeliveryProgress = Math.min(100, Math.round((cartTotal / FREE_DELIVERY_THRESHOLD) * 100));

  const handleCheckout = () => {
    requireAuth(() => {
      setIsCartDrawerOpen(false);
      navigate("/shipping");
    }, "/shipping");
  };

  const handleViewCart = () => {
    requireAuth(() => {
      setIsCartDrawerOpen(false);
      navigate("/cart");
    }, "/cart");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-all duration-300">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#F8FAF5]">
            <div className="flex items-center space-x-2.5">
              <BrandLogo variant="symbol" href={null} size="sm" />
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg tracking-tight">Shopping Cart</h3>
                <p className="text-xs text-gray-500 font-medium">
                  {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} in cart
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="px-5 py-3 bg-emerald-50/70 border-b border-emerald-100/60">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="flex items-center space-x-1.5 text-emerald-800">
                <Truck className="w-4 h-4 text-[#16A34A]" />
                {cartTotal >= FREE_DELIVERY_THRESHOLD ? (
                  <span>🎉 You've unlocked FREE Delivery!</span>
                ) : (
                  <span>
                    Add <strong className="text-[#16A34A]">Rs. {freeDeliveryRemaining.toFixed(2)}</strong> for FREE Delivery
                  </span>
                )}
              </span>
              <span className="text-emerald-700">{freeDeliveryProgress}%</span>
            </div>
            <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#16A34A] h-full rounded-full transition-all duration-500"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-gray-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-emerald-50/70 p-3 flex items-center justify-center">
                  <BrandLogo variant="symbol" href={null} size="lg" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-lg">Your cart is empty</h4>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Explore fresh vegetables, fruits, dairy, and grocery items to fill your cart!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate("/shop");
                  }}
                  className="btn btn-primary text-sm px-6 py-2.5 mt-2"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.cartItemId || item.product} className="pt-4 first:pt-0 flex gap-3.5 items-center">
                  <Link
                    to={`/product/${item.product}`}
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="w-18 h-18 w-[72px] h-[72px] rounded-xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0 overflow-hidden flex items-center justify-center hover:opacity-90"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product}`}
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="font-bold text-sm text-gray-900 hover:text-[#16A34A] transition-colors truncate block"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        {item.selectedVariant?.name || "Standard"}
                      </span>
                      <span className="text-xs font-bold text-[#16A34A]">
                        Rs. {item.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.cartItemId || item.product, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                          title="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-900">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId || item.product, item.qty + 1)}
                          disabled={item.qty >= (item.countInStock || 999)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30"
                          title="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-black text-gray-900">
                          Rs. {(item.price * item.qty).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.cartItemId || item.product)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-gray-50/80 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Delivery Estimate</span>
                  <span className={cartTotal >= FREE_DELIVERY_THRESHOLD ? "text-[#16A34A] font-bold" : "font-bold text-gray-900"}>
                    {cartTotal >= FREE_DELIVERY_THRESHOLD ? "FREE" : "Rs. 250.00"}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#16A34A] text-base font-black">
                    Rs. {(cartTotal + (cartTotal >= FREE_DELIVERY_THRESHOLD ? 0 : 250)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleViewCart}
                  className="btn btn-secondary text-xs py-3 font-bold text-center"
                >
                  View Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="btn btn-primary text-xs py-3 font-bold flex items-center justify-center space-x-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>100% Quality & Freshness Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
