import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, ShieldCheck, ShoppingBag, FileText, CheckCircle2, Truck, Store } from "lucide-react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { authHeaders } from "../utils/auth";
import CreditCardPayment from "../components/checkout/CreditCardPayment";
import toast from "react-hot-toast";

const Payment = () => {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(
    () => localStorage.getItem("paymentMethod") || "Credit Card"
  );

  // Read shipping details from localStorage
  const address = localStorage.getItem("shippingAddress") || "";
  const city = localStorage.getItem("shippingCity") || "";
  const postalCode = localStorage.getItem("shippingPostalCode") || "";
  const country = localStorage.getItem("shippingCountry") || "Sri Lanka";

  // Card Form State
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardErrors, setCardErrors] = useState({});

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      navigate("/cart");
      return;
    }
    if (!address || !city) {
      toast.error("Please fill in shipping details first.");
      navigate("/shipping");
    }
  }, [cartItems, address, city, navigate]);

  // Compute Prices
  const tax = cartTotal * 0.05;
  const delivery = cartTotal >= 5000 ? 0 : 250;
  const grandTotal = cartTotal + tax + delivery;

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    localStorage.setItem("paymentMethod", method);
    setCardErrors({});
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const formatted = value.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted.substring(0, 19));
    setCardErrors((prev) => ({ ...prev, cardNumber: "" }));
  };

  const handleCardExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setCardExpiry(value.substring(0, 5));
    setCardErrors((prev) => ({ ...prev, cardExpiry: "" }));
  };

  const validateCreditCard = () => {
    const digitsOnly = cardNumber.replace(/\D/g, "");
    const errors = {};

    if (!cardName.trim()) {
      errors.cardName = "Card holder name is required.";
    }

    if (!/^\d{16}$/.test(digitsOnly)) {
      errors.cardNumber = "Card number must contain exactly 16 digits.";
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
      errors.cardExpiry = "Expiry date must be in MM/YY format.";
    }

    if (!/^\d{3}$/.test(cardCVC)) {
      errors.cardCVC = "CVV must contain exactly 3 digits.";
    }

    return errors;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const cleanCardNumber = cardNumber.replace(/\D/g, "");
    let lastFourDigits = "";

    if (paymentMethod === "Credit Card") {
      const validationErrors = validateCreditCard();
      setCardErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        toast.error("Please fill in valid card details.");
        return;
      }

      lastFourDigits = cleanCardNumber.slice(-4);
    }

    setLoading(true);

    const orderPayload = {
      orderItems: cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        selectedVariant: item.selectedVariant,
        selectedPrice: item.selectedPrice || item.price,
        selectedStock: item.selectedStock || item.countInStock,
        selectedQuantity: item.qty,
        product: item.product,
      })),
      shippingAddress: { address, city, postalCode, country },
      paymentMethod,
      paymentStatus: paymentMethod === "Credit Card" ? "Paid" : "Pending",
      lastFourDigits,
      itemsPrice: cartTotal,
      taxPrice: tax,
      shippingPrice: delivery,
      totalPrice: grandTotal,
    };

    try {
      const config = authHeaders();

      if (paymentMethod === "Credit Card") {
        toast.loading("Processing card payment...", { id: "payment" });
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const { data } = await axios.post("/api/orders", orderPayload, config);

      if (paymentMethod === "Credit Card") {
        toast.success("Payment Confirmed!", { id: "payment" });
      } else {
        toast.success("Order Placed Successfully!");
      }

      clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error(error.response?.data?.message || "Checkout failed. Please try again.", {
        id: "payment",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAF5] min-h-screen py-8 sm:py-12">
      <div className="container-custom max-w-4xl mx-auto space-y-6">
        <Link
          to="/shipping"
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-[#16A34A] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Shipping Address</span>
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Review Order & Payment
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Step 2 of 2: Confirm your details and finalize your supermarket order.
          </p>
        </div>

        {/* 3-Step Wizard Indicator */}
        <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center space-x-2 text-[#16A34A] font-bold text-xs">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center text-xs">
              ✓
            </span>
            <span>Delivery</span>
          </div>
          <div className="h-[2px] flex-1 bg-[#16A34A]"></div>
          <div className="flex items-center space-x-2 text-[#16A34A] font-bold text-xs">
            <span className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs">
              2
            </span>
            <span>Payment</span>
          </div>
          <div className="h-[2px] flex-1 bg-gray-200"></div>
          <div className="flex items-center space-x-2 text-gray-400 font-medium text-xs">
            <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
              3
            </span>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Left Column: Delivery Summary & Payment Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Delivery Destination Card */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="text-[#16A34A] w-4 h-4" />
                <span>Delivery Details</span>
              </h3>
              <div className="text-xs font-semibold text-gray-700">
                <p className="font-extrabold text-sm text-gray-900">{address}</p>
                <p className="mt-0.5">{city}, {postalCode}, {country}</p>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="text-[#16A34A] w-4 h-4" />
                <span>Choose Payment Mode</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "Credit Card"
                      ? "border-[#16A34A] bg-emerald-50/60 shadow-xs"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="payMode"
                    value="Credit Card"
                    checked={paymentMethod === "Credit Card"}
                    onChange={() => handlePaymentMethodChange("Credit Card")}
                    className="text-[#16A34A] focus:ring-[#16A34A]"
                  />
                  <div>
                    <span className="text-xs font-black text-gray-900 block">Credit / Debit Card</span>
                    <span className="text-[10px] text-gray-400">Visa / MasterCard</span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "Cash on Delivery"
                      ? "border-[#16A34A] bg-emerald-50/60 shadow-xs"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="payMode"
                    value="Cash on Delivery"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={() => handlePaymentMethodChange("Cash on Delivery")}
                    className="text-[#16A34A] focus:ring-[#16A34A]"
                  />
                  <div>
                    <span className="text-xs font-black text-gray-900 block">Cash on Delivery</span>
                    <span className="text-[10px] text-gray-400">Pay at Door / Pickup</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Card Payment Form or COD Confirmation */}
            {paymentMethod === "Credit Card" ? (
              <form
                onSubmit={handlePlaceOrder}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <CreditCard className="text-[#16A34A] w-4 h-4" />
                    <span>Enter Card Details</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-gray-400">TEST / DEMO MODE READY</span>
                  </div>
                </div>

                <CreditCardPayment
                  cardDetails={{ cardName, cardNumber, cardExpiry, cardCVC }}
                  errors={cardErrors}
                  onCardNameChange={(value) => {
                    setCardName(value);
                    setCardErrors((prev) => ({ ...prev, cardName: "" }));
                  }}
                  onCardNumberChange={handleCardNumberChange}
                  onCardExpiryChange={handleCardExpiryChange}
                  onCardCVCChange={(e) => {
                    setCardCVC(e.target.value.replace(/\D/g, "").substring(0, 3));
                    setCardErrors((prev) => ({ ...prev, cardCVC: "" }));
                  }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full py-4 text-sm font-black flex items-center justify-center space-x-2 shadow-xl shadow-emerald-700/20"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      <span>Confirm & Pay Rs. {grandTotal.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center space-x-3 text-emerald-800">
                  <Store className="w-6 h-6 text-[#16A34A]" />
                  <h3 className="font-extrabold text-sm text-gray-900">
                    Pay with Cash on Delivery / Store Pickup
                  </h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  Your order will be prepared and packed at Saumya Stores Wellawaya.
                  You can pay the exact amount in Sri Lankan Rupees (Rs. {grandTotal.toFixed(2)}) in cash when receiving your groceries.
                </p>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn btn-primary w-full py-4 text-sm font-black flex items-center justify-center space-x-2 shadow-xl shadow-emerald-700/20"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      <span>Place Order (Cash on Delivery)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary Review */}
          <div className="lg:col-span-2 space-y-4 sticky top-28">
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-gray-900 border-b pb-3 flex items-center gap-2">
                <ShoppingBag className="text-[#16A34A] w-4 h-4" />
                <span>Order Summary ({cartItems.length})</span>
              </h3>

              {/* Items List */}
              <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1 space-y-2">
                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId || item.product}
                    className="pt-2 first:pt-0 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-contain bg-gray-50 border p-0.5 shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-bold text-gray-800 truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {item.selectedVariant?.name || "Standard"} • {item.qty} pcs
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 shrink-0">
                      Rs. {(item.qty * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-3 border-t border-gray-100 text-xs font-semibold text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span className="text-gray-900 font-bold">Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className={delivery === 0 ? "text-[#16A34A] font-bold" : "text-gray-900 font-bold"}>
                    {delivery === 0 ? "FREE" : `Rs. ${delivery.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-black text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-base text-[#14532D]">Rs. {grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-[#16A34A]" />
              <span>256-bit SSL Bank-Grade Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
