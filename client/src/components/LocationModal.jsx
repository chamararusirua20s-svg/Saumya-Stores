import React, { useContext, useState } from "react";
import { X, MapPin, Truck, Store, Check, Search } from "lucide-react";
import { LocationContext } from "../context/LocationContext";

const LocationModal = () => {
  const {
    selectedLocation,
    changeLocation,
    fulfillmentType,
    setFulfillmentType,
    isLocationModalOpen,
    setIsLocationModalOpen,
    locations,
  } = useContext(LocationContext);

  const [searchQuery, setSearchQuery] = useState("");

  if (!isLocationModalOpen) return null;

  const filteredLocations = locations.filter(
    (loc) =>
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsLocationModalOpen(false)}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Select Delivery Location</h3>
              <p className="text-xs text-gray-500 font-medium">Choose how and where you'd like your groceries</p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fulfillment Method Toggle */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFulfillmentType("delivery")}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center space-y-2 transition-all ${
              fulfillmentType === "delivery"
                ? "border-[#16A34A] bg-emerald-50/60 shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Truck
              className={`w-6 h-6 ${
                fulfillmentType === "delivery" ? "text-[#16A34A]" : "text-gray-400"
              }`}
            />
            <div>
              <span className="block font-bold text-sm text-gray-900">Doorstep Delivery</span>
              <span className="text-[11px] text-gray-500">Free over Rs. 5,000</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFulfillmentType("pickup")}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center space-y-2 transition-all ${
              fulfillmentType === "pickup"
                ? "border-[#16A34A] bg-emerald-50/60 shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Store
              className={`w-6 h-6 ${
                fulfillmentType === "pickup" ? "text-[#16A34A]" : "text-gray-400"
              }`}
            />
            <div>
              <span className="block font-bold text-sm text-gray-900">Store Pickup</span>
              <span className="text-[11px] text-emerald-700 font-semibold">100% Free • Wellawaya Hub</span>
            </div>
          </button>
        </div>

        {/* Store Pickup Notice */}
        {fulfillmentType === "pickup" ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
            <div className="flex items-start space-x-2.5">
              <Store className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-emerald-950">Saumya Stores Supermarket Hub</h4>
                <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">
                  No 54/2 Saumya Stores, Haputhale Road, Wellawaya, Sri Lanka.
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  Ready for collection within 30 minutes of placing order!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search town, city or district in Sri Lanka..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Towns List */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {filteredLocations.map((loc) => {
                const isSelected = selectedLocation.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => changeLocation(loc)}
                    className={`w-full text-left p-3 rounded-2xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? "border-[#16A34A] bg-emerald-50/50 shadow-xs"
                        : "border-gray-100 hover:border-emerald-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isSelected ? "bg-[#16A34A] text-white" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-gray-900">{loc.city}</span>
                          {loc.isHub && (
                            <span className="text-[10px] bg-emerald-100 text-[#16A34A] font-extrabold px-2 py-0.5 rounded-full">
                              MAIN HUB
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{loc.district} District • {loc.eta}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-[#16A34A]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="btn btn-primary w-full py-3 text-sm font-bold"
          >
            Confirm Location & Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
