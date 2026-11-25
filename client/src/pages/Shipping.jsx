import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, ArrowLeft, ArrowRight, ShieldCheck, Truck, Store, CheckCircle2 } from "lucide-react";
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

const Shipping = () => {
  const { cartItems } = useContext(CartContext);
  const { selectedLocation, fulfillmentType, setFulfillmentType } = useContext(LocationContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const [address, setAddress] = useState(() => localStorage.getItem("shippingAddress") || "");
  const [city, setCity] = useState(() => localStorage.getItem("shippingCity") || selectedLocation.city || "Wellawaya");
  const [postalCode, setPostalCode] = useState(() => localStorage.getItem("shippingPostalCode") || "91200");
  const [country, setCountry] = useState(() => localStorage.getItem("shippingCountry") || "Sri Lanka");
  const [province, setProvince] = useState(() => localStorage.getItem("shippingProvince") || "Uva Province");
  const [district, setDistrict] = useState(() => localStorage.getItem("shippingDistrict") || selectedLocation.district || "Monaragala");
  const [phone, setPhone] = useState(() => localStorage.getItem("shippingPhone") || "");
  const [deliveryNotes, setDeliveryNotes] = useState(() => localStorage.getItem("shippingNotes") || "");

  const [paymentMethod, setPaymentMethod] = useState(
    () => localStorage.getItem("paymentMethod") || "Credit Card"
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (fulfillmentType === "delivery" && (!address.trim() || !city.trim() || !phone.trim())) {
      toast.error("Please fill in delivery address, city, and mobile phone number.");
      return;
    }

    // Save details to localStorage
    localStorage.setItem("shippingAddress", address || "Saumya Stores Wellawaya Pickup");
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
    <div className="bg-[#F8FAF5] min-h-screen py-8 sm:py-12">
      <div className="container-custom max-w-2xl mx-auto space-y-6">
        <Link
          to="/cart"
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-[#16A34A] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Return to Cart</span>
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Delivery & Fulfillment
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Step 1 of 2: Confirm where and how you would like to receive your groceries.
          </p>
        </div>

        {/* 3-Step Wizard Indicator */}
        <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center space-x-2 text-[#16A34A] font-bold text-xs">
            <span className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs">
              1
            </span>
            <span>Delivery</span>
          </div>
          <div className="h-[2px] flex-1 bg-[#16A34A]/30"></div>
          <div className="flex items-center space-x-2 text-gray-400 font-medium text-xs">
            <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
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

        {/* Delivery / Store Pickup Choice */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFulfillmentType("delivery")}
            className={`p-4 rounded-2xl border-2 flex items-center space-x-3 transition-all ${
              fulfillmentType === "delivery"
                ? "border-[#16A34A] bg-emerald-50/60 shadow-xs"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <Truck className={`w-5 h-5 ${fulfillmentType === "delivery" ? "text-[#16A34A]" : "text-gray-400"}`} />
            <div className="text-left">
              <span className="block font-bold text-xs sm:text-sm text-gray-900">Doorstep Delivery</span>
              <span className="text-[10px] text-gray-500">Free over Rs. 5,000</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFulfillmentType("pickup")}
            className={`p-4 rounded-2xl border-2 flex items-center space-x-3 transition-all ${
              fulfillmentType === "pickup"
                ? "border-[#16A34A] bg-emerald-50/60 shadow-xs"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <Store className={`w-5 h-5 ${fulfillmentType === "pickup" ? "text-[#16A34A]" : "text-gray-400"}`} />
            <div className="text-left">
              <span className="block font-bold text-xs sm:text-sm text-gray-900">Wellawaya Store Pickup</span>
              <span className="text-[10px] text-[#16A34A] font-bold">100% Free • Hub Ready</span>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          {fulfillmentType === "pickup" ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3">
              <div className="flex items-start space-x-3">
                <Store className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-[#14532D]">Pickup Hub Location</h4>
                  <p className="text-xs text-gray-700 font-medium">
                    No 54/2 Saumya Stores, Haputhale Road, Wellawaya, Sri Lanka.
                  </p>
                  <p className="text-[11px] text-emerald-800">
                    Contact: +94 77 2434 641 • Open 7:00 AM - 10:00 PM Daily
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Pickup Contact Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+94 7X XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b pb-3">
                <MapPin className="text-[#16A34A] w-4 h-4" />
                <span>Delivery Address in Sri Lanka</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Street Address & House / Apt No *
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. 54/2 Haputhale Road"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City / Town *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Wellawaya"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="input"
                  >
                    {SRI_LANKA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Province</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="input text-xs"
                  >
                    {SRI_LANKA_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="91200"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Country</label>
                  <input type="text" className="input bg-gray-50" value={country} readOnly />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Recipient Contact Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+94 77 XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Delivery Landmark or Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near clock tower, call before arrival"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="input text-xs"
                />
              </div>
            </div>
          )}

          {/* Payment Method Option */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
              Payment Preference
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-2xl border-2 flex items-center space-x-3 cursor-pointer transition-all ${
                  paymentMethod === "Credit Card"
                    ? "border-[#16A34A] bg-emerald-50/50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="shipPayment"
                  value="Credit Card"
                  checked={paymentMethod === "Credit Card"}
                  onChange={() => setPaymentMethod("Credit Card")}
                  className="text-[#16A34A] focus:ring-[#16A34A]"
                />
                <div>
                  <span className="font-extrabold text-xs text-gray-900 block">Online Card Payment</span>
                  <span className="text-[10px] text-gray-500">Visa / MasterCard SSL</span>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-2xl border-2 flex items-center space-x-3 cursor-pointer transition-all ${
                  paymentMethod === "Cash on Delivery"
                    ? "border-[#16A34A] bg-emerald-50/50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="shipPayment"
                  value="Cash on Delivery"
                  checked={paymentMethod === "Cash on Delivery"}
                  onChange={() => setPaymentMethod("Cash on Delivery")}
                  className="text-[#16A34A] focus:ring-[#16A34A]"
                />
                <div>
                  <span className="font-extrabold text-xs text-gray-900 block">
                    Cash on Delivery / Pickup
                  </span>
                  <span className="text-[10px] text-gray-500">Pay when receiving items</span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full py-4 text-sm font-black flex items-center justify-center space-x-2 shadow-xl shadow-emerald-700/20"
          >
            <span>Proceed to Payment Confirmation</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="flex items-center justify-center space-x-1.5 text-xs text-gray-400 font-bold uppercase tracking-wider">
          <ShieldCheck size={14} className="text-[#16A34A]" />
          <span>Your information is encrypted & safely delivered</span>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
