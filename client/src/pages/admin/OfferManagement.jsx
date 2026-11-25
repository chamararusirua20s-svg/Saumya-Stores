import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle2,
  Edit2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { authHeaders } from "../../utils/auth";
import {
  createOffer,
  deleteOffer,
  fetchAdminOffers,
  toggleOffer,
  updateOffer,
} from "../../utils/offerApi";

const blankOffer = {
  title: "",
  subtitle: "",
  description: "",
  offerType: "today",
  discount: 0,
  image: "",
  desktopBanner: "",
  mobileBanner: "",
  buttonText: "Shop Now",
  status: "active",
  enabled: true,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  displayOrder: 1,
};

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState(blankOffer);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingField, setUploadingField] = useState("");

  const loadOffers = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminOffers();
      setOffers(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const startCreate = () => {
    setForm({ ...blankOffer, displayOrder: offers.length + 1 });
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (offer) => {
    setForm({
      ...blankOffer,
      ...offer,
      image: offer.image || "",
      desktopBanner: offer.desktopBanner || offer.image || "",
      mobileBanner: offer.mobileBanner || offer.image || "",
    });
    setEditingId(offer.id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "enabled" ? { status: checked ? "active" : "hidden" } : {}),
    });
  };

  const uploadImage = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploadingField(field);

    try {
      const config = authHeaders();
      config.headers["Content-Type"] = "multipart/form-data";
      const { data } = await axios.post("/api/upload", formData, config);
      setForm((prev) => ({ ...prev, [field]: data, ...(field === "desktopBanner" ? { image: data } : {}) }));
      toast.success("Offer image uploaded.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingField("");
    }
  };

  const submitOffer = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    const payload = {
      ...form,
      discount: Number(form.discount) || 0,
      displayOrder: Number(form.displayOrder) || 0,
      image: form.image || form.desktopBanner,
      desktopBanner: form.desktopBanner || form.image,
      mobileBanner: form.mobileBanner || form.desktopBanner || form.image,
      status: form.enabled ? "active" : "hidden",
    };

    try {
      if (editingId) {
        await updateOffer(editingId, payload);
        toast.success("Offer updated.");
      } else {
        await createOffer(payload);
        toast.success("Offer created.");
      }
      setShowForm(false);
      setEditingId(null);
      await loadOffers();
      window.dispatchEvent(new Event("homepage-content-updated"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save offer.");
    }
  };

  const removeOffer = async (id) => {
    if (!window.confirm("Delete this offer?")) return;
    try {
      await deleteOffer(id);
      toast.success("Offer deleted.");
      await loadOffers();
      window.dispatchEvent(new Event("homepage-content-updated"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete offer.");
    }
  };

  const switchOffer = async (offer) => {
    try {
      await toggleOffer(offer.id, !offer.enabled);
      toast.success(offer.enabled ? "Offer hidden." : "Offer activated.");
      await loadOffers();
      window.dispatchEvent(new Event("homepage-content-updated"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update offer status.");
    }
  };

  const imageField = (field, label) => (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">{label}</label>
      <div className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 group">
        {form[field] ? (
          <img src={form[field]} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Upload className="w-8 h-8 mb-2" />
            <span className="text-xs font-bold">Upload banner</span>
          </div>
        )}
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => uploadImage(e, field)}
        />
      </div>
      {uploadingField === field && <p className="text-xs text-primary font-bold">Uploading...</p>}
      <input
        type="text"
        name={field}
        className="input text-xs"
        placeholder="Or paste image URL"
        value={form[field] || ""}
        onChange={handleChange}
      />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Home Offers Management</h2>
          <p className="text-gray-500 mt-1">Manage today's, weekend, hot, and promotional homepage offers.</p>
        </div>
        <button onClick={startCreate} className="btn btn-primary flex items-center gap-2 px-6 py-3 self-start">
          <Plus size={20} />
          <span>Add Offer</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitOffer} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="text-xl font-black text-gray-900">{editingId ? "Edit Offer" : "Create Offer"}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Offer Title</label>
                  <input name="title" className="input" value={form.title} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Offer Subtitle</label>
                  <input name="subtitle" className="input" value={form.subtitle} onChange={handleChange} placeholder="Today Only" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea name="description" rows="4" className="input py-3" value={form.description} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Offer Type</label>
                  <select name="offerType" className="input h-11" value={form.offerType} onChange={handleChange}>
                    <option value="today">Today Only</option>
                    <option value="weekend">Weekend Special</option>
                    <option value="hot">Hot Offers</option>
                    <option value="special">Special Offer</option>
                    <option value="bogo">BOGO Deals</option>
                    <option value="limited">Limited Time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Discount %</label>
                  <input name="discount" type="number" className="input" value={form.discount} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                  <input name="displayOrder" type="number" className="input" value={form.displayOrder} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Button Text</label>
                  <input name="buttonText" className="input" value={form.buttonText} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input name="startDate" type="date" className="input" value={form.startDate} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <input name="endDate" type="date" className="input" value={form.endDate} onChange={handleChange} required />
                </div>
              </div>

              <label className="flex items-center gap-3 p-4 bg-secondary-light rounded-2xl border border-primary/10">
                <input
                  type="checkbox"
                  name="enabled"
                  checked={form.enabled}
                  onChange={handleChange}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-bold text-gray-700">Enable this offer on the customer homepage</span>
              </label>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {imageField("desktopBanner", "Desktop Banner")}
                {imageField("mobileBanner", "Mobile Banner")}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Card Image URL</label>
                <input
                  type="text"
                  name="image"
                  className="input text-xs"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="Uses desktop banner if empty"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary px-5 py-3">Cancel</button>
            <button type="submit" className="btn btn-primary px-6 py-3 flex items-center gap-2">
              <Save size={18} />
              <span>{editingId ? "Update Offer" : "Save Offer"}</span>
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Offer</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Type</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Dates</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">Loading offers...</td></tr>
              ) : offers.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">No offers created yet.</td></tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                          {offer.image || offer.desktopBanner ? (
                            <img src={offer.image || offer.desktopBanner} alt={offer.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="text-gray-300" size={22} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{offer.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{offer.description}</p>
                          <p className="text-[10px] font-black text-primary uppercase tracking-wider">{offer.discount}% OFF</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-secondary-light text-primary text-xs font-bold capitalize">
                        {offer.offerType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                      <p>{offer.startDate}</p>
                      <p>{offer.endDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        offer.enabled ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {offer.enabled ? <CheckCircle2 size={14} /> : <EyeOff size={14} />}
                        {offer.enabled ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => switchOffer(offer)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                          {offer.enabled ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button onClick={() => startEdit(offer)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => removeOffer(offer.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfferManagement;
