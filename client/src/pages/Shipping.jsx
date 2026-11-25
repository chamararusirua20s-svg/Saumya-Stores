import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  Store,
  CheckCircle2,
  Phone,
  CreditCard,
  Banknote,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  FileText,
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import { LocationContext } from "../context/LocationContext";
import toast from "react-hot-toast";

const SRI_LANKA_PROVINCES = [
  "Uva Province",
  "Western Province",
  "Central Province",
  "Southern Province",
  "Eastern Province",
  "North Western Province",
  "North Central Province",
  "Sabaragamuwa Province",
  "Northern Province",
];

const SRI_LANKA_DISTRICTS = [
  "Monaragala",
  "Badulla",
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Ratnapura",
  "Kegalle",
  "Trincomalee",
  "Batticaloa",
  "Ampara",
];

const FREE_DELIVERY_THRESHOLD = 5000;

const Shipping = () => {
  const { cartItems, cartTotal } = useContext(CartContext);
  const { selectedLocation, fulfillmentType, setFulfillmentType } = useContext(LocationContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const [address, setAddress] = useState(() => localStorage.getItem("shippingAddress") || "");
  const [city, setCity] = useState(
    () => localStorage.getItem("shippingCity") || selectedLocation.city || "Wellawaya"
  );
  const [postalCode, setPostalCode] = useState(
    () => localStorage.getItem("shippingPostalCode") || "91200"
  );
  const [country, setCountry] = useState(
    () => localStorage.getItem("shippingCountry") || "Sri Lanka"
  );
  const [province, setProvince] = useState(
    () => localStorage.getItem("shippingProvince") || "Uva Province"
  );
  const [district, setDistrict] = useState(
    () => localStorage.getItem("shippingDistrict") || selectedLocation.district || "Monaragala"
  );
  const [phone, setPhone] = useState(() => localStorage.getItem("shippingPhone") || "");
  const [deliveryNotes, setDeliveryNotes] = useState(
    () => localStorage.getItem("shippingNotes") || ""
  );

  const [paymentMethod, setPaymentMethod] = useState(
    () => localStorage.getItem("paymentMethod") || "Credit Card"
  );

  // Calculations for Order Summary
  const deliveryFee =
    fulfillmentType === "pickup"
      ? 0
      : cartTotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : 250;
  const tax = Number((cartTotal * 0.05).toFixed(2));
  const finalTotal = Number((cartTotal + deliveryFee + tax).toFixed(2));
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (fulfillmentType === "delivery" && (!address.trim() || !city.trim() || !phone.trim())) {
      toast.error("Please fill in delivery address, city, and mobile phone number.");
      return;
    }

    if (fulfillmentType === "pickup" && !phone.trim()) {
      toast.error("Please provide a contact phone number for pickup coordination.");
      return;
    }

    // Save details to localStorage
    localStorage.setItem("shippingAddress", address || "Saumya Stores Wellawaya Pickup Hub");
    localStorage.setItem("shippingCity", city);
    localStorage.setItem("shippingPostalCode", postalCode || "91200");
    localStorage.setItem("shippingCountry", country);
    localStorage.setItem("shippingProvince", province);
    localStorage.setItem("shippingDistrict", district);
    localStorage.setItem("shippingPhone", phone);
    localStorage.setItem("shippingNotes", deliveryNotes);
    localStorage.setItem("paymentMethod", paymentMethod);

    navigate("/payment");
  };

  return (
    <div className="bg-[#F5F8F2] min-h-screen py-8 sm:py-12">
      <div className="container-custom max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/cart"
            className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-gray-500 hover:text-[#16A34A] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Shopping Cart</span>
          </Link>
          <span className="text-xs font-semibold text-gray-400">
            {totalItemsCount} {totalItemsCount === 1 ? "Grocery Item" : "Grocery Items"} in Basket
          </span>
        </div>

        {/* Page Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-black uppercase tracking-wider text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Checkout Process</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Delivery & Fulfillment
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Step 1 of 3: Confirm where and how you would like to receive your groceries.
          </p>
        </div>

        {/* ── Redesigned 3-Step Wizard Indicator ── */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            {/* Step 1: Active */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 z-10 bg-white pr-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-md shadow-emerald-700/20 ring-4 ring-emerald-50">
                1
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#16A34A] block leading-none">
                  Step 1
                </span>
                <span className="text-xs sm:text-sm font-black text-gray-900 block mt-0.5">
                  Delivery
                </span>
              </div>
            </div>

            {/* Connecting Track 1-2 */}
            <div className="flex-1 h-0.5 mx-2 sm:mx-4 bg-[#16A34A]/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-[#16A34A] w-1/2" />
            </div>

            {/* Step 2: Next */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 z-10 bg-white px-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs sm:text-sm font-bold border border-gray-200">
                2
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block leading-none">
                  Step 2
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-500 block mt-0.5">
                  Payment
                </span>
              </div>
            </div>

            {/* Connecting Track 2-3 */}
            <div className="flex-1 h-0.5 mx-2 sm:mx-4 bg-gray-200" />

            {/* Step 3: Confirmation */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 z-10 bg-white pl-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs sm:text-sm font-bold border border-gray-200">
                3
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block leading-none">
                  Step 3
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-500 block mt-0.5">
                  Confirmation
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Two-Column Layout (Form on Left + Order Summary on Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Fulfillment Choice + Form */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Fulfillment Mode Choice Cards */}
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500">
                Select Fulfillment Method
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Doorstep Delivery Card */}
                <button
                  type="button"
                  onClick={() => setFulfillmentType("delivery")}
                  className={`p-5 rounded-2xl sm:rounded-3xl border-2 text-left transition-all duration-200 relative flex items-start space-x-4 ${
                    fulfillmentType === "delivery"
                      ? "border-[#16A34A] bg-[#F0FDF4] shadow-md shadow-emerald-900/5 ring-2 ring-[#16A34A]/20"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      fulfillmentType === "delivery"
                        ? "bg-[#16A34A] text-white shadow-sm"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Truck className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-sm sm:text-base text-gray-900 block truncate">
                        Doorstep Delivery
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                      Express delivery to your home or office address.
                    </p>
                    <div className="mt-2.5 inline-flex items-center space-x-1.5 text-[11px] font-bold text-[#14532D] bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                      <span>Free over Rs. 5,000</span>
                    </div>
                  </div>

                  {/* Radio Checkmark Circle */}
                  <div className="absolute top-5 right-5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        fulfillmentType === "delivery"
                          ? "bg-[#16A34A] text-white"
                          : "border-2 border-gray-300"
                      }`}
                    >
                      {fulfillmentType === "delivery" && <CheckCircle2 className="w-4 h-4 fill-white text-[#16A34A]" />}
                    </div>
                  </div>
                </button>

                {/* Wellawaya Store Pickup Card */}
                <button
                  type="button"
                  onClick={() => setFulfillmentType("pickup")}
                  className={`p-5 rounded-2xl sm:rounded-3xl border-2 text-left transition-all duration-200 relative flex items-start space-x-4 ${
                    fulfillmentType === "pickup"
                      ? "border-[#16A34A] bg-[#F0FDF4] shadow-md shadow-emerald-900/5 ring-2 ring-[#16A34A]/20"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      fulfillmentType === "pickup"
                        ? "bg-[#16A34A] text-white shadow-sm"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Store className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-sm sm:text-base text-gray-900 block truncate">
                        Wellawaya Store Pickup
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                      Collect directly from our supermarket hub.
                    </p>
                    <div className="mt-2.5 inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                      <span>100% Free • Hub Ready</span>
                    </div>
                  </div>

                  {/* Radio Checkmark Circle */}
                  <div className="absolute top-5 right-5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        fulfillmentType === "pickup"
                          ? "bg-[#16A34A] text-white"
                          : "border-2 border-gray-300"
                      }`}
                    >
                      {fulfillmentType === "pickup" && <CheckCircle2 className="w-4 h-4 fill-white text-[#16A34A]" />}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Main Form Box */}
            <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              {fulfillmentType === "pickup" ? (
                /* Store Pickup Details */
                <div className="space-y-5">
                  <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-100/80 space-y-3">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#16A34A] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Store className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#16A34A] bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                          Pickup Location
                        </span>
                        <h4 className="font-black text-base text-gray-900">
                          Saumya Stores Wellawaya Central Hub
                        </h4>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed">
                          No 54/2 Saumya Stores, Haputhale Road, Wellawaya, Sri Lanka.
                        </p>
                        <p className="text-xs text-emerald-800 font-bold pt-1">
                          Hotline: +94 77 2434 641 • Open 7:00 AM - 10:00 PM Daily
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">
                      Pickup Contact Mobile Number <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Phone className="w-4.5 h-4.5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        placeholder="077 123 4567 or +94 77 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input input-icon-left text-sm"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium mt-1">
                      We'll send an SMS notification when your grocery basket is ready for collection.
                    </p>
                  </div>
                </div>
              ) : (
                /* Doorstep Delivery Address Form */
                <div className="space-y-5">
                  <div className="flex items-center space-x-2.5 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0">
                      <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                        Delivery Address in Sri Lanka
                      </h3>
                      <p className="text-xs text-gray-400 font-medium">
                        Enter your precise shipping destination for prompt doorstep fulfillment
                      </p>
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">
                      Street Address & House / Apt No <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      className="input text-sm"
                      placeholder="e.g. 54/2 Haputhale Road, Apartment 3B"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  {/* Responsive Row 1: City / Town & District */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">
                        City / Town <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        className="input text-sm"
                        placeholder="e.g. Wellawaya, Colombo, Kandy"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">
                        District <span className="text-red-500 font-bold">*</span>
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="input select-custom text-sm font-medium"
                      >
                        {SRI_LANKA_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Responsive Row 2: Province, Postal Code, Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">
                        Province <span className="text-red-500 font-bold">*</span>
                      </label>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="input select-custom text-sm font-medium"
                      >
                        {SRI_LANKA_PROVINCES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        className="input text-sm"
                        placeholder="e.g. 91200"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        className="input bg-gray-50 text-gray-700 font-semibold cursor-not-allowed"
                        value={country}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">
                      Recipient Contact Phone Number <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Phone className="w-4.5 h-4.5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        placeholder="077 123 4567 or +94 77 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input input-icon-left text-sm"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium mt-1">
                      Our dispatch driver will call this number prior to arrival.
                    </p>
                  </div>

                  {/* Delivery Landmark or Notes */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">
                      Delivery Landmark or Special Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near the clock tower, yellow gate, ring doorbell"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      className="input text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Payment Method Preference */}
              <div className="space-y-3 pt-5 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                    Payment Preference
                  </h3>
                  <span className="text-[11px] text-gray-400 font-semibold">
                    Select preferred option
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Card Option */}
                  <label
                    className={`p-4 rounded-2xl border-2 flex items-center space-x-3.5 cursor-pointer transition-all duration-200 ${
                      paymentMethod === "Credit Card"
                        ? "border-[#16A34A] bg-[#F0FDF4] shadow-xs ring-1 ring-[#16A34A]/20"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipPayment"
                      value="Credit Card"
                      checked={paymentMethod === "Credit Card"}
                      onChange={() => setPaymentMethod("Credit Card")}
                      className="w-4 h-4 text-[#16A34A] focus:ring-[#16A34A] accent-[#16A34A]"
                    />
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#14532D] flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-extrabold text-xs sm:text-sm text-gray-900 block truncate">
                        Online Card Payment
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium block">
                        Visa / MasterCard / AMEX SSL
                      </span>
                    </div>
                  </label>

                  {/* COD Option */}
                  <label
                    className={`p-4 rounded-2xl border-2 flex items-center space-x-3.5 cursor-pointer transition-all duration-200 ${
                      paymentMethod === "Cash on Delivery"
                        ? "border-[#16A34A] bg-[#F0FDF4] shadow-xs ring-1 ring-[#16A34A]/20"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipPayment"
                      value="Cash on Delivery"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={() => setPaymentMethod("Cash on Delivery")}
                      className="w-4 h-4 text-[#16A34A] focus:ring-[#16A34A] accent-[#16A34A]"
                    />
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-extrabold text-xs sm:text-sm text-gray-900 block truncate">
                        Cash on Delivery
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium block">
                        Pay upon receiving groceries
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="btn btn-primary w-full h-14 text-sm sm:text-base font-black flex items-center justify-center space-x-2.5 shadow-xl shadow-emerald-700/25 hover:shadow-2xl hover:shadow-emerald-700/35 active:scale-[0.99] transition-all duration-200"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 font-bold uppercase tracking-wider py-1">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>Saumya Stores Certified Fresh & Secure Delivery</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Modern Order Summary Card */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-28 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                    <ShoppingBag className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-black text-base text-gray-900">Order Summary</h3>
                </div>
                <Link
                  to="/cart"
                  className="text-xs font-bold text-[#16A34A] hover:underline"
                >
                  Edit Cart
                </Link>
              </div>

              {/* Cart Items List Preview (Scrollable up to 3 items) */}
              <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.cartItemId || item.product} className="py-2.5 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-contain bg-gray-50 border border-gray-100 p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 truncate">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium">
                        Qty: <strong className="text-gray-700">{item.qty}</strong> • {item.selectedVariant?.name || "Standard"}
                      </p>
                    </div>
                    <span className="text-xs font-black text-gray-900 shrink-0">
                      Rs. {(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Free Delivery Status Bar */}
              {fulfillmentType === "delivery" && (
                <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-950 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Delivery Status</span>
                    </span>
                    <span className="font-black text-[#14532D]">
                      {cartTotal >= FREE_DELIVERY_THRESHOLD ? "FREE Delivery" : `Add Rs. ${(FREE_DELIVERY_THRESHOLD - cartTotal).toFixed(2)}`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-emerald-200/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#16A34A] rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.round((cartTotal / FREE_DELIVERY_THRESHOLD) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Price Calculation Breakdown */}
              <div className="space-y-2.5 text-xs font-semibold pt-1">
                <div className="flex justify-between text-gray-600">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-gray-900">Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? "text-[#16A34A] font-bold" : "font-bold text-gray-900"}>
                    {fulfillmentType === "pickup"
                      ? "FREE (Store Pickup)"
                      : deliveryFee === 0
                      ? "FREE"
                      : "Rs. 250.00"}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-bold text-gray-900">Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-black text-gray-900 block">Total Due</span>
                    <span className="text-[10px] text-gray-400 font-medium">Includes all taxes & delivery</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-[#14532D]">
                    Rs. {finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Supermarket Guarantee Strip */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span>Quality checked produce & groceries</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span>Doorstep delivery or Wellawaya pickup</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span>Secure 256-bit encrypted checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
