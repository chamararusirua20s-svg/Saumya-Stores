import axios from "axios";
import { authHeaders } from "./auth";
import { resolveHomepageImage } from "./homeContentStorage";

const fallbackDate = "2026-12-31";

export const normalizeOffer = (offer = {}, index = 0) => ({
  ...offer,
  id: offer.id || offer._id || `offer-${index + 1}`,
  title: offer.title || "",
  subtitle: offer.subtitle || "",
  description: offer.description || "",
  offerType: offer.offerType || "today",
  discount: Number(offer.discount) || 0,
  image: resolveHomepageImage(offer.image || offer.desktopBanner || ""),
  desktopBanner: resolveHomepageImage(offer.desktopBanner || offer.image || ""),
  mobileBanner: resolveHomepageImage(offer.mobileBanner || offer.image || offer.desktopBanner || ""),
  buttonText: offer.buttonText || "Shop Now",
  status: offer.status || (offer.enabled === false ? "hidden" : "active"),
  enabled: offer.enabled !== false,
  active: offer.enabled !== false && (offer.status || "active") === "active",
  startDate: offer.startDate ? String(offer.startDate).split("T")[0] : new Date().toISOString().split("T")[0],
  endDate: offer.endDate ? String(offer.endDate).split("T")[0] : fallbackDate,
  displayOrder: Number(offer.displayOrder) || index + 1,
});

export const fetchPublicOffers = async () => {
  const { data } = await axios.get("/api/offers");
  return (data || []).map(normalizeOffer).sort((a, b) => a.displayOrder - b.displayOrder);
};

export const fetchAdminOffers = async () => {
  const { data } = await axios.get("/api/offers/admin", authHeaders());
  return (data || []).map(normalizeOffer).sort((a, b) => a.displayOrder - b.displayOrder);
};

export const createOffer = async (payload) => {
  const { data } = await axios.post("/api/offers/admin", payload, authHeaders());
  return normalizeOffer(data);
};

export const updateOffer = async (id, payload) => {
  const { data } = await axios.put(`/api/offers/admin/${id}`, payload, authHeaders());
  return normalizeOffer(data);
};

export const deleteOffer = async (id) => {
  const { data } = await axios.delete(`/api/offers/admin/${id}`, authHeaders());
  return data;
};

export const toggleOffer = async (id, enabled) => {
  const { data } = await axios.put(`/api/offers/admin/${id}/toggle`, { enabled }, authHeaders());
  return normalizeOffer(data);
};
