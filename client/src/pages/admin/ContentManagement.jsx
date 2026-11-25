import React, { useState, useEffect } from "react";
import axios from "axios";
import { authHeaders } from "../../utils/auth";
import { 
  getHomepageContent, 
  saveHomepageContent 
} from "../../utils/homeContentStorage";
import {
  fetchAdminOffers,
  createOffer,
  updateOffer,
  deleteOffer as deleteOfferApi,
  toggleOffer as toggleOfferApi
} from "../../utils/offerApi";
import { 
  Layout, 
  Tag, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Upload, 
  Save, 
  Eye, 
  EyeOff, 
  AlertCircle 
} from "lucide-react";
import toast from "react-hot-toast";

const ContentManagement = () => {
  // Tabs: 'hero', 'offers', 'banners', 'categories'
  const [activeTab, setActiveTab] = useState("hero");
  const [content, setContent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Offers state (MongoDB API driven)
  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);

  // Edit states
  const [editingSlideId, setEditingSlideId] = useState(null);
  const [slideForm, setSlideForm] = useState({
    title: "",
    subtitle: "",
    badge: "",
    offer: "",
    bg: "",
    link: ""
  });

  const [editingOfferId, setEditingOfferId] = useState(null);
  const [offerForm, setOfferForm] = useState({
    title: "",
    description: "",
    discount: 0,
    image: "",
    startDate: "",
    endDate: "",
    active: true
  });

  const [editingPromoId, setEditingPromoId] = useState(null);
  const [promoForm, setPromoForm] = useState({
    title: "",
    description: "",
    active: true,
    bgGradient: "from-amber-500 to-orange-600"
  });

  useEffect(() => {
    setContent(getHomepageContent());
    fetchCategories();
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoadingOffers(true);
    try {
      const data = await fetchAdminOffers();
      setOffers(data);
    } catch (error) {
      console.error("Error loading admin offers:", error);
      toast.error("Failed to load offers from server.");
    } finally {
      setLoadingOffers(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/categories");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const persist = (updatedContent) => {
    setContent(updatedContent);
    saveHomepageContent(updatedContent);
  };

  // Image upload handler
  const handleImageUpload = async (e, type, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = authHeaders();
      config.headers["Content-Type"] = "multipart/form-data";
      const { data } = await axios.post("/api/upload", formData, config);
      
      if (type === "slide") {
        setSlideForm((prev) => ({ ...prev, [fieldName]: data }));
      } else if (type === "offer") {
        setOfferForm((prev) => ({ ...prev, [fieldName]: data }));
      }
      
      setUploading(false);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error("Upload failed. Try entering a URL manually.");
    }
  };

  // ---------------- HERO SLIDER CRUD ----------------
  const startAddSlide = () => {
    setEditingSlideId("new");
    setSlideForm({
      title: "",
      subtitle: "",
      badge: "NEW OFFER",
      offer: "Special discount",
      bg: "",
      link: "/shop"
    });
  };

  const startEditSlide = (slide) => {
    setEditingSlideId(slide.id);
    setSlideForm({ ...slide });
  };

  const saveSlide = () => {
    if (!slideForm.title || !slideForm.bg) {
      toast.error("Title and background image are required.");
      return;
    }

    let updatedSlides = [...content.heroSlides];
    if (editingSlideId === "new") {
      const newSlide = {
        ...slideForm,
        id: `slide-${Date.now()}`
      };
      updatedSlides.push(newSlide);
      toast.success("Slide added!");
    } else {
      updatedSlides = updatedSlides.map((s) => (s.id === editingSlideId ? { ...slideForm, id: s.id } : s));
      toast.success("Slide updated!");
    }

    persist({ ...content, heroSlides: updatedSlides });
    setEditingSlideId(null);
  };

  const deleteSlide = (id) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      const updatedSlides = content.heroSlides.filter((s) => s.id !== id);
      persist({ ...content, heroSlides: updatedSlides });
      toast.success("Slide deleted!");
    }
  };

  // ---------------- SPECIAL OFFERS CRUD ----------------
  const startAddOffer = () => {
    setEditingOfferId("new");
    setOfferForm({
      title: "",
      description: "",
      discount: 10,
      image: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // +5 days
      active: true
    });
  };

  const startEditOffer = (offer) => {
    setEditingOfferId(offer.id || offer._id);
    setOfferForm({
      title: offer.title || "",
      description: offer.description || "",
      discount: offer.discount || 0,
      image: offer.image || "",
      startDate: offer.startDate ? offer.startDate.split("T")[0] : "",
      endDate: offer.endDate ? offer.endDate.split("T")[0] : "",
      active: offer.active !== false
    });
  };

  const saveOffer = async () => {
    if (!offerForm.title || !offerForm.description || !offerForm.image) {
      toast.error("Title, description, and image are required.");
      return;
    }
    if (!offerForm.startDate || !offerForm.endDate) {
      toast.error("Start date and End date are required.");
      return;
    }

    try {
      if (editingOfferId === "new") {
        await createOffer(offerForm);
        toast.success("Offer created successfully!");
      } else {
        await updateOffer(editingOfferId, offerForm);
        toast.success("Offer updated successfully!");
      }
      setEditingOfferId(null);
      await loadOffers();
      window.dispatchEvent(new Event("homepage-content-updated"));
    } catch (error) {
      console.error("Error saving offer:", error);
      toast.error(error.response?.data?.message || "Failed to save offer.");
    }
  };

  const deleteOffer = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await deleteOfferApi(id);
        toast.success("Offer deleted successfully!");
        await loadOffers();
        window.dispatchEvent(new Event("homepage-content-updated"));
      } catch (error) {
        console.error("Error deleting offer:", error);
        toast.error("Failed to delete offer.");
      }
    }
  };

  const toggleOfferActive = async (offer) => {
    try {
      const offerId = offer.id || offer._id;
      await toggleOfferApi(offerId, !offer.active);
      toast.success(`Offer ${offer.active ? "deactivated" : "activated"}!`);
      await loadOffers();
      window.dispatchEvent(new Event("homepage-content-updated"));
    } catch (error) {
      console.error("Error toggling offer status:", error);
      toast.error("Failed to update offer status.");
    }
  };

  // ---------------- PROMO BANNERS CRUD ----------------
  const startEditPromo = (promo) => {
    setEditingPromoId(promo.id);
    setPromoForm({ ...promo });
  };

  const savePromo = () => {
    const updatedPromos = content.promotionalBanners.map((p) => 
      p.id === editingPromoId ? { ...promoForm, id: p.id } : p
    );
    persist({ ...content, promotionalBanners: updatedPromos });
    setEditingPromoId(null);
    toast.success("Promo Banner updated!");
  };

  // ---------------- CATEGORY SHOWCASE SELECTION ----------------
  const handleCategoryCheckboxChange = (catName) => {
    let updatedCats = [...content.homepageCategories];
    if (updatedCats.includes(catName)) {
      // Don't let them unselect all categories
      if (updatedCats.length <= 1) {
        toast.error("Please keep at least one category visible.");
        return;
      }
      updatedCats = updatedCats.filter((name) => name !== catName);
    } else {
      updatedCats.push(catName);
    }
    persist({ ...content, homepageCategories: updatedCats });
    toast.success("Category showcase updated!");
  };

  if (!content) return <div className="text-center py-20 font-bold text-gray-500">Loading Configuration...</div>;

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Homepage Content Management</h2>
        <p className="text-gray-500 mt-1">Configure sliders, banners, offers, and section visibility dynamically.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: "hero", label: "Hero Slider", icon: <Layout className="w-4 h-4" /> },
          { id: "offers", label: "Today's Offers", icon: <Tag className="w-4 h-4" /> },
          { id: "banners", label: "Promo Banners", icon: <ImageIcon className="w-4 h-4" /> },
          { id: "categories", label: "Showcased Categories", icon: <Save className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setEditingSlideId(null);
              setEditingOfferId(null);
              setEditingPromoId(null);
            }}
            className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-bold text-sm transition-all ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-950"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ---------------- Tab 1: HERO SLIDER ---------------- */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-sm text-gray-500 font-medium">Configure carousel banners rotating on the Home hero.</span>
            {!editingSlideId && (
              <button
                onClick={startAddSlide}
                className="btn btn-primary flex items-center space-x-2 text-sm px-4 py-2.5 rounded-xl font-bold"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hero Slide</span>
              </button>
            )}
          </div>

          {editingSlideId && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg space-y-6 animate-scale-in">
              <h3 className="text-lg font-black text-gray-900">
                {editingSlideId === "new" ? "Add New Slide" : "Edit Slide"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Main Title</label>
                    <input
                      type="text"
                      value={slideForm.title}
                      onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                      className="input"
                      placeholder="e.g. Fresh Vegetables"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={slideForm.subtitle}
                      onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                      className="input"
                      placeholder="e.g. Farm Fresh Every Day"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Badge Text</label>
                      <input
                        type="text"
                        value={slideForm.badge}
                        onChange={(e) => setSlideForm({ ...slideForm, badge: e.target.value })}
                        className="input"
                        placeholder="e.g. Premium Quality"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Offer Badge</label>
                      <input
                        type="text"
                        value={slideForm.offer}
                        onChange={(e) => setSlideForm({ ...slideForm, offer: e.target.value })}
                        className="input"
                        placeholder="e.g. Up to 30% OFF"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Link Path</label>
                    <input
                      type="text"
                      value={slideForm.link}
                      onChange={(e) => setSlideForm({ ...slideForm, link: e.target.value })}
                      className="input"
                      placeholder="e.g. /shop?category=vegetables"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Slide Image Background</label>
                  <div className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden bg-gray-50 group">
                    {slideForm.bg ? (
                      <>
                        <img src={slideForm.bg} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-bold shadow-xl">
                            Change Image
                            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "slide", "bg")} />
                          </label>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 space-y-2">
                        <Upload className="w-12 h-12 text-gray-300 mx-auto" />
                        <p className="text-xs text-gray-500 font-medium">Click to upload custom slide background</p>
                      </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, "slide", "bg")} />
                  </div>
                  {uploading && <p className="text-xs text-primary animate-pulse text-center">Uploading image background...</p>}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Or Direct Image URL</label>
                    <input
                      type="text"
                      value={slideForm.bg}
                      onChange={(e) => setSlideForm({ ...slideForm, bg: e.target.value })}
                      className="input text-xs"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingSlideId(null)}
                  className="btn px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveSlide}
                  className="btn btn-primary px-5 py-2.5 font-bold rounded-xl"
                >
                  Save Slide
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.heroSlides.map((slide) => (
              <div
                key={slide.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-44 bg-gray-900">
                  <img src={slide.bg} alt={slide.title} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute top-4 left-4 flex flex-col space-y-1 items-start">
                    <span className="px-2.5 py-0.5 bg-primary text-white text-[9px] font-black uppercase rounded-full">
                      {slide.badge}
                    </span>
                    <span className="px-2.5 py-0.5 bg-accent text-white text-[9px] font-black uppercase rounded-full">
                      {slide.offer}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-grow space-y-2">
                  <h4 className="font-extrabold text-gray-900 text-lg leading-tight">{slide.title}</h4>
                  <p className="text-xs text-gray-500 font-medium">{slide.subtitle}</p>
                  <p className="text-[10px] text-primary font-bold truncate">Link: {slide.link}</p>
                </div>

                <div className="p-4 border-t border-gray-50 flex justify-end space-x-2 bg-gray-50/50">
                  <button
                    onClick={() => startEditSlide(slide)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSlide(slide.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- Tab 2: SPECIAL OFFERS ---------------- */}
      {activeTab === "offers" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-sm text-gray-500 font-medium">Create promotional items shown in the "Today's Special Offers" section.</span>
            {!editingOfferId && (
              <button
                onClick={startAddOffer}
                className="btn btn-primary flex items-center space-x-2 text-sm px-4 py-2.5 rounded-xl font-bold"
              >
                <Plus className="w-4 h-4" />
                <span>Add Offer Coupon</span>
              </button>
            )}
          </div>

          {editingOfferId && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg space-y-6 animate-scale-in">
              <h3 className="text-lg font-black text-gray-900">
                {editingOfferId === "new" ? "Create Special Offer" : "Edit Special Offer"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Offer Title</label>
                    <input
                      type="text"
                      value={offerForm.title}
                      onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                      className="input"
                      placeholder="e.g. Fresh Vegetables Sale"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      value={offerForm.description}
                      onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                      rows="3"
                      className="input py-2"
                      placeholder="e.g. Get up to 30% OFF on selected vegetables."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Discount (%)</label>
                      <input
                        type="number"
                        value={offerForm.discount}
                        onChange={(e) => setOfferForm({ ...offerForm, discount: parseInt(e.target.value) || 0 })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Start Date</label>
                      <input
                        type="date"
                        value={offerForm.startDate}
                        onChange={(e) => setOfferForm({ ...offerForm, startDate: e.target.value })}
                        className="input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">End Date</label>
                      <input
                        type="date"
                        value={offerForm.endDate}
                        onChange={(e) => setOfferForm({ ...offerForm, endDate: e.target.value })}
                        className="input text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 py-2">
                    <input
                      type="checkbox"
                      id="offer-active"
                      checked={offerForm.active}
                      onChange={(e) => setOfferForm({ ...offerForm, active: e.target.checked })}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                    />
                    <label htmlFor="offer-active" className="text-sm font-bold text-gray-700">Make offer active immediately</label>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Offer Banner / Card Image</label>
                  <div className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden bg-gray-50 group">
                    {offerForm.image ? (
                      <>
                        <img src={offerForm.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-bold shadow-xl">
                            Change Image
                            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "offer", "image")} />
                          </label>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 space-y-2">
                        <Upload className="w-12 h-12 text-gray-300 mx-auto" />
                        <p className="text-xs text-gray-500 font-medium">Click to upload offer banner</p>
                      </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, "offer", "image")} />
                  </div>
                  {uploading && <p className="text-xs text-primary animate-pulse text-center">Uploading offer image...</p>}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Or Direct Image URL</label>
                    <input
                      type="text"
                      value={offerForm.image}
                      onChange={(e) => setOfferForm({ ...offerForm, image: e.target.value })}
                      className="input text-xs"
                      placeholder="https://example.com/offer.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingOfferId(null)}
                  className="btn px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveOffer}
                  className="btn btn-primary px-5 py-2.5 font-bold rounded-xl"
                >
                  Save Offer
                </button>
              </div>
            </div>
          )}

          {loadingOffers && offers.length === 0 ? (
            <div className="text-center py-12 font-bold text-gray-400">Loading Offers...</div>
          ) : offers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 text-gray-500 font-medium">
              No active offers found. Click "Add Offer Coupon" to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((offer) => (
                <div
                  key={offer._id || offer.id}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col md:flex-row hover:shadow-md transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="md:w-1/3 relative h-40 md:h-auto bg-gray-100">
                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                      {offer.discount}% OFF
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-6 md:w-2/3 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-gray-900 text-lg leading-tight">{offer.title}</h4>
                        <button
                          onClick={() => toggleOfferActive(offer)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            offer.active
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-gray-50 text-gray-400 border-gray-200"
                          }`}
                          title={offer.active ? "Click to Deactivate" : "Click to Activate"}
                        >
                          {offer.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium line-clamp-2">{offer.description}</p>
                      <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-bold pt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md">Start: {offer.startDate}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md">End: {offer.endDate}</span>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2 border-t border-gray-50">
                      <button
                        onClick={() => startEditOffer(offer)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteOffer(offer._id || offer.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- Tab 3: PROMO BANNERS ---------------- */}
      {activeTab === "banners" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-gray-900">Active Promotional Banners</h3>
              <p className="text-xs text-gray-500">Configure text promotions visible in highlights.</p>
            </div>

            {content.promotionalBanners.map((promo) => (
              <div key={promo.id} className="border border-gray-150 rounded-2xl p-6 space-y-4">
                {editingPromoId === promo.id ? (
                  <div className="space-y-4 animate-scale-in">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Banner Title</label>
                      <input
                        type="text"
                        value={promoForm.title}
                        onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description / Coupon Info</label>
                      <textarea
                        value={promoForm.description}
                        onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                        rows="3"
                        className="input py-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Gradient Style</label>
                        <select
                          value={promoForm.bgGradient}
                          onChange={(e) => setPromoForm({ ...promoForm, bgGradient: e.target.value })}
                          className="input h-11"
                        >
                          <option value="from-amber-500 to-orange-600">Orange/Amber</option>
                          <option value="from-emerald-500 to-green-600">Green/Emerald</option>
                          <option value="from-red-500 to-rose-600">Red/Rose</option>
                          <option value="from-blue-500 to-indigo-600">Blue/Indigo</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <input
                          type="checkbox"
                          id="promo-active"
                          checked={promoForm.active}
                          onChange={(e) => setPromoForm({ ...promoForm, active: e.target.checked })}
                          className="w-4 h-4 rounded text-primary accent-primary"
                        />
                        <label htmlFor="promo-active" className="text-sm font-bold text-gray-700">Active on Homepage</label>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => setEditingPromoId(null)}
                        className="btn px-4 py-2 bg-gray-150 text-gray-700 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={savePromo}
                        className="btn btn-primary px-4 py-2 rounded-xl"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-extrabold text-gray-900">{promo.title}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          promo.active ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-150 text-gray-400"
                        }`}>
                          {promo.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{promo.description}</p>
                      <span className="text-[10px] text-gray-400 font-bold block">Theme gradient: {promo.bgGradient}</span>
                    </div>

                    <button
                      onClick={() => startEditPromo(promo)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Edit Promotional Banner"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- Tab 4: SHOWCASED CATEGORIES ---------------- */}
      {activeTab === "categories" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-black text-gray-900">Showcased Homepage Categories</h3>
            <p className="text-xs text-gray-500">Check or uncheck which categories are showcased on the store landing page.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
            {categories.map((cat) => {
              const isChecked = content.homepageCategories.includes(cat.name);
              return (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryCheckboxChange(cat.name)}
                  className={`flex items-center space-x-3 p-4 rounded-2xl border text-left transition-all ${
                    isChecked
                      ? "bg-secondary-light/75 border-primary/25 text-gray-900 shadow-sm"
                      : "bg-white border-gray-150 text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    isChecked 
                      ? "bg-primary border-primary text-white" 
                      : "border-gray-300"
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="font-bold text-sm">{cat.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 bg-amber-50 border border-amber-100 p-4 rounded-2xl text-amber-800 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-500" />
            <p className="font-medium">Changes to visible categories are immediately synchronized client-side and affect filters on the home Category Showcase.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
