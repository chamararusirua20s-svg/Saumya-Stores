import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Truck,
  Store,
  Sparkles,
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import { LocationContext } from "../context/LocationContext";
import { AuthContext } from "../context/AuthContext";
import { AuthModalContext } from "../context/AuthModalContext";
import toast from "react-hot-toast";
import BrandLogo from "../components/BrandLogo";

const FREE_DELIVERY_THRESHOLD = 5000;

const Cart = () => {
  const { cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal } =
    useContext(CartContext);
  const { selectedLocation, fulfillmentType } = useContext(LocationContext);
  const { user } = useContext(AuthContext);
  const { requireAuth } = useContext(AuthModalContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState(
    () => localStorage.getItem("paymentMethod") || "Credit Card"
  );
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    localStorage.setItem("paymentMethod", method);
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "GIFT2026" || promoCode.trim().toUpperCase() === "SAVER500") {
      setPromoApplied(true);
      toast.success("Promo code applied! 5% discount activated.");
    } else {
      toast.error("Invalid coupon code. Try GIFT2026");
    }
  };

  const checkoutHandler = () => {
    requireAuth(() => {
      localStorage.setItem("paymentMethod", paymentMethod);
      navigate("/shipping");
    }, "/shipping");
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#F8FAF5] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-emerald-50 rounded-3xl p-4 flex items-center justify-center">
            <BrandLogo variant="symbol" href={null} size="xl" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">Your Basket is Empty</h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              You haven't added any fresh groceries to your cart yet. Let's find some crisp produce or pantry essentials!
            </p>
          </div>
          <Link to="/shop" className="btn btn-primary w-full py-3.5 text-sm font-bold">
            Start Supermarket Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Delivery calculations
  const discountAmount = promoApplied ? cartTotal * 0.05 : 0;
  const taxableAmount = cartTotal - discountAmount;
  const tax = taxableAmount * 0.05;
  const isDeliveryFree = cartTotal >= FREE_DELIVERY_THRESHOLD || fulfillmentType === "pickup";
  const delivery = isDeliveryFree ? 0 : 250;
  const grandTotal = taxableAmount + tax + delivery;

  const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - cartTotal);
  const deliveryProgress = Math.min(100, Math.round((cartTotal / FREE_DELIVERY_THRESHOLD) * 100));

  return (
    <div className="bg-[#F8FAF5] min-h-screen py-8 sm:py-12">
      <div className="container-custom space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              My Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Review your items and proceed to fast delivery in {selectedLocation.city}
            </p>
          </div>
          <Link
            to="/shop"
            className="text-[#16A34A] hover:text-[#14532D] font-bold text-xs sm:text-sm flex items-center space-x-1.5"
          >
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-emerald-900">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-[#16A34A]" />
            {isDeliveryFree ? (
              <span>🎉 You qualify for FREE Delivery!</span>
            ) : (
              <span>
                Add <strong className="text-[#16A34A]">Rs. {remainingForFreeDelivery.toFixed(2)}</strong> more to get FREE Delivery!
              </span>
            )}
          </div>
          <div className="w-full sm:w-60 bg-emerald-200/70 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#16A34A] h-full rounded-full transition-all duration-500"
              style={{ width: `${deliveryProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="font-extrabold text-sm text-gray-700">
                  {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"} in Cart
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-gray-100 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId || item.product}
                    className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Thumbnail & Title */}
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      <Link
                        to={`/product/${item.product}`}
                        className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 p-2 flex-shrink-0 flex items-center justify-center hover:opacity-90"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </Link>

                      <div className="min-w-0">
                        <Link
                          to={`/product/${item.product}`}
                          className="font-extrabold text-sm text-gray-900 hover:text-[#16A34A] transition-colors truncate block"
                        >
                          {item.name}
                        </Link>
                        <span className="inline-block text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1">
                          Size: {item.selectedVariant?.name || "Standard"}
                        </span>
                        <p className="text-xs font-bold text-[#16A34A] mt-1">
                          Rs. {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Line Total */}
                    <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-6 pt-2 sm:pt-0 border-t sm:border-0 border-gray-50">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId || item.product, item.qty - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-xs font-black text-gray-900">
                          {item.qty}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId || item.product, item.qty + 1)
                          }
                          disabled={item.qty >= (item.countInStock || 999)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Total Price */}
                      <span className="text-sm font-black text-gray-900 min-w-[90px] text-right">
                        Rs. {(item.price * item.qty).toFixed(2)}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.cartItemId || item.product)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 space-y-5 sticky top-28">
              <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs font-semibold text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">Rs. {cartTotal.toFixed(2)}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount (5% Promo)</span>
                    <span className="font-bold">- Rs. {discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Tax (5%)</span>
                  <span className="text-gray-900 font-bold">Rs. {tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Delivery Charges</span>
                  <span
                    className={
                      delivery === 0 ? "text-[#16A34A] font-extrabold" : "text-gray-900 font-bold"
                    }
                  >
                    {delivery === 0 ? "FREE" : `Rs. ${delivery.toFixed(2)}`}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between text-sm font-black text-gray-900">
                  <span>Final Total</span>
                  <span className="text-xl text-[#14532D]">Rs. {grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-700 block">Payment Method</span>
                <div className="grid grid-cols-1 gap-2">
                  <label
                    className={`flex items-center space-x-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "Credit Card"
                        ? "border-[#16A34A] bg-emerald-50/50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Credit Card"
                      checked={paymentMethod === "Credit Card"}
                      onChange={() => handlePaymentMethodChange("Credit Card")}
                      className="text-[#16A34A] focus:ring-[#16A34A]"
                    />
                    <CreditCard className="w-4 h-4 text-[#16A34A]" />
                    <span className="text-xs font-bold text-gray-800">Online Card Payment</span>
                  </label>

                  <label
                    className={`flex items-center space-x-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "Cash on Delivery"
                        ? "border-[#16A34A] bg-emerald-50/50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={() => handlePaymentMethodChange("Cash on Delivery")}
                      className="text-[#16A34A] focus:ring-[#16A34A]"
                    />
                    <Store className="w-4 h-4 text-[#16A34A]" />
                    <span className="text-xs font-bold text-gray-800">Cash on Delivery / Pickup</span>
                  </label>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={checkoutHandler}
                className="btn btn-primary w-full py-4 text-sm font-bold flex items-center justify-center space-x-2 shadow-xl shadow-emerald-700/20"
              >
                <span>Proceed to Delivery & Checkout</span>
                <ChevronRight size={18} />
              </button>

              {/* Safe Checkout Badges */}
              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider pt-2">
                <ShieldCheck size={14} className="text-[#16A34A]" />
                <span>SSL Encrypted Checkout • Saumya Stores</span>
              </div>
            </div>

            {/* Promo Code Box */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
              <span className="text-xs font-bold text-gray-800 block">Have a Coupon Code?</span>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. GIFT2026"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="input py-2 text-xs"
                />
                <button type="submit" className="btn btn-primary text-xs py-2 px-4 shrink-0 font-bold">
                  Apply
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
