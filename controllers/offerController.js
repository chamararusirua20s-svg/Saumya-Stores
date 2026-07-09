const Offer = require("../models/Offer");

const defaultOffers = [
  {
    title: "Fresh Vegetables Sale",
    subtitle: "Today's Special Offers",
    description: "Get up to 30% OFF on selected vegetables.",
    offerType: "today",
    discount: 30,
    image: "vegetables_slide",
    desktopBanner: "vegetables_slide",
    mobileBanner: "vegetables_slide",
    buttonText: "Shop Now",
    status: "active",
    enabled: true,
    startDate: new Date("2026-07-10"),
    endDate: new Date("2026-07-25"),
    displayOrder: 1,
  },
  {
    title: "Fresh Fruits Bonanza",
    subtitle: "Today Only",
    description: "Sweet and juicy local fruits 20% OFF.",
    offerType: "today",
    discount: 20,
    image: "fruits_slide",
    desktopBanner: "fruits_slide",
    mobileBanner: "fruits_slide",
    buttonText: "Shop Now",
    status: "active",
    enabled: true,
    startDate: new Date("2026-07-08"),
    endDate: new Date("2026-07-18"),
    displayOrder: 2,
  },
  {
    title: "Dairy Buy 2 Get 1 Free",
    subtitle: "Hot Offers",
    description: "Buy 2 and get 1 free on Anchor & Highland dairy cheese products.",
    offerType: "hot",
    discount: 33,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80",
    desktopBanner: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1200&q=80",
    mobileBanner: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80",
    buttonText: "Shop Now",
    status: "active",
    enabled: true,
    startDate: new Date("2026-07-01"),
    endDate: new Date("2026-07-31"),
    displayOrder: 3,
  },
  {
    title: "Weekend Bakery Special",
    subtitle: "Weekend Special",
    description: "Freshly baked cookies and cakes.",
    offerType: "weekend",
    discount: 10,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    desktopBanner: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
    mobileBanner: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    buttonText: "Shop Now",
    status: "active",
    enabled: true,
    startDate: new Date("2026-07-09"),
    endDate: new Date("2026-07-12"),
    displayOrder: 4,
  },
  {
    title: "Today's Deals",
    subtitle: "TODAY ONLY",
    description: "Flat Rs. 200 OFF on Orders above Rs. 2000",
    offerType: "today",
    discount: 0,
    buttonText: "Shop Now",
    status: "active",
    enabled: true,
    startDate: new Date("2026-07-01"),
    endDate: new Date("2026-12-31"),
    displayOrder: 10,
  },
  {
    title: "Weekend Deals",
    subtitle: "WEEKEND SPECIAL",
    description: "Get 15% Cashback on Selected Cards",
    offerType: "weekend",
    discount: 15,
    buttonText: "Shop Now",
    status: "active",
    enabled: true,
    startDate: new Date("2026-07-01"),
    endDate: new Date("2026-12-31"),
    displayOrder: 11,
  },
  {
    title: "Flash Sale",
    subtitle: "HOT DEALS",
    description: "Up to 50% OFF on Beverages",
    offerType: "hot",
    discount: 50,
    buttonText: "Shop Now",
    status: "active",
    enabled: true,
    startDate: new Date("2026-07-01"),
    endDate: new Date("2026-12-31"),
    displayOrder: 12,
  },
  {
    title: "Special Discounts",
    subtitle: "SPECIAL OFFER",
    description: "Save Rs. 500 on Fresh Vegetables",
    offerType: "special",
    discount: 0,
    buttonText: "Shop Now",
    status: "active",
    enabled: true,
    startDate: new Date("2026-07-01"),
    endDate: new Date("2026-12-31"),
    displayOrder: 13,
  },
  {
    title: "Buy One Get One",
    subtitle: "BOGO DEALS",
    description: "BOGO on Bakery Products",
    offerType: "bogo",
    discount: 0,
    buttonText: "Shop Now",
    status: "active",
    enabled: true,
    startDate: new Date("2026-07-01"),
    endDate: new Date("2026-12-31"),
    displayOrder: 14,
  },
  {
    title: "Limited Offers",
    subtitle: "LIMITED TIME",
    description: "Free Delivery on Orders above Rs. 1500",
    offerType: "limited",
    discount: 0,
    buttonText: "Shop Now",
    status: "active",
    enabled: true,
    startDate: new Date("2026-07-01"),
    endDate: new Date("2026-12-31"),
    displayOrder: 15,
  },
];

const ensureDefaultOffers = async () => {
  const count = await Offer.countDocuments();
  if (count === 0) {
    await Offer.insertMany(defaultOffers);
  }
};

const normalizeOfferPayload = (body) => ({
  title: body.title,
  subtitle: body.subtitle || "",
  description: body.description,
  offerType: body.offerType || "today",
  discount: Number(body.discount) || 0,
  image: body.image || body.desktopBanner || "",
  desktopBanner: body.desktopBanner || body.image || "",
  mobileBanner: body.mobileBanner || body.image || body.desktopBanner || "",
  buttonText: body.buttonText || "Shop Now",
  status: body.status || (body.enabled === false ? "hidden" : "active"),
  enabled: body.enabled !== false,
  startDate: body.startDate,
  endDate: body.endDate,
  displayOrder: Number(body.displayOrder) || 0,
});

const getPublicOffers = async (req, res) => {
  await ensureDefaultOffers();

  const now = new Date();
  const offers = await Offer.find({
    enabled: true,
    status: "active",
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).sort({ displayOrder: 1, createdAt: 1 });

  res.json(offers);
};

const getAdminOffers = async (req, res) => {
  await ensureDefaultOffers();
  const offers = await Offer.find({}).sort({ displayOrder: 1, createdAt: 1 });
  res.json(offers);
};

const getOfferById = async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ message: "Offer not found" });
  res.json(offer);
};

const createOffer = async (req, res) => {
  const offer = new Offer(normalizeOfferPayload(req.body));
  const createdOffer = await offer.save();
  res.status(201).json(createdOffer);
};

const updateOffer = async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ message: "Offer not found" });

  Object.assign(offer, normalizeOfferPayload({ ...offer.toObject(), ...req.body }));
  const updatedOffer = await offer.save();
  res.json(updatedOffer);
};

const deleteOffer = async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ message: "Offer not found" });

  await offer.deleteOne();
  res.json({ message: "Offer deleted" });
};

const toggleOffer = async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ message: "Offer not found" });

  offer.enabled = req.body.enabled !== undefined ? req.body.enabled : !offer.enabled;
  offer.status = offer.enabled ? "active" : "hidden";
  const updatedOffer = await offer.save();
  res.json(updatedOffer);
};

module.exports = {
  defaultOffers,
  getPublicOffers,
  getAdminOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleOffer,
};
