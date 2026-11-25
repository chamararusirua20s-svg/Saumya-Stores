import React, { createContext, useState, useEffect } from "react";

export const SRI_LANKAN_LOCATIONS = [
  { id: "wellawaya", city: "Wellawaya", district: "Monaragala", eta: "Within 45 mins", isHub: true, note: "Main Store Hub & Pickup Location" },
  { id: "buttala", city: "Buttala", district: "Monaragala", eta: "Within 2 hours", note: "Local Delivery" },
  { id: "monaragala", city: "Monaragala Town", district: "Monaragala", eta: "Same Day (3-4 hrs)", note: "Express Regional" },
  { id: "badulla", city: "Badulla", district: "Badulla", eta: "Same Day", note: "Hill Country Express" },
  { id: "bandarawela", city: "Bandarawela", district: "Badulla", eta: "Same Day", note: "Hill Country Express" },
  { id: "colombo", city: "Colombo (01-15)", district: "Colombo", eta: "Next Day Delivery", note: "Islandwide Courier" },
  { id: "kandy", city: "Kandy City", district: "Kandy", eta: "Next Day Delivery", note: "Islandwide Courier" },
  { id: "galle", city: "Galle Fort & Town", district: "Galle", eta: "Next Day Delivery", note: "Islandwide Courier" },
  { id: "negombo", city: "Negombo", district: "Gampaha", eta: "Next Day Delivery", note: "Islandwide Courier" },
  { id: "matara", city: "Matara", district: "Matara", eta: "Next Day Delivery", note: "Islandwide Courier" },
];

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(() => {
    try {
      const saved = localStorage.getItem("saumya_selected_location");
      return saved ? JSON.parse(saved) : SRI_LANKAN_LOCATIONS[0];
    } catch {
      return SRI_LANKAN_LOCATIONS[0];
    }
  });

  const [fulfillmentType, setFulfillmentType] = useState(() => {
    return localStorage.getItem("saumya_fulfillment_type") || "delivery";
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("saumya_selected_location", JSON.stringify(selectedLocation));
    } catch (e) {
      console.error(e);
    }
  }, [selectedLocation]);

  useEffect(() => {
    localStorage.setItem("saumya_fulfillment_type", fulfillmentType);
  }, [fulfillmentType]);

  const changeLocation = (loc) => {
    setSelectedLocation(loc);
    setIsLocationModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        changeLocation,
        fulfillmentType,
        setFulfillmentType,
        isLocationModalOpen,
        setIsLocationModalOpen,
        locations: SRI_LANKAN_LOCATIONS,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
