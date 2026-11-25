import React, { useState, useEffect } from "react";
import axios from "axios";
import { authHeaders } from "../../utils/auth";
import { Plus, Trash2, Layers, Search, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", image: "" });
  const [submitting, setSubmitting] = useState(false);



  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/categories");
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await axios.post("/api/categories", formData, authHeaders());
      toast.success("Category created!");
      setFormData({ name: "", description: "", image: "" });
      setShowForm(false);
      await fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure? All products in this category will become uncategorized.")) {
      try {
        await axios.delete(`/api/categories/${id}`, authHeaders());
        toast.success("Category removed");
        fetchCategories();
      } catch (error) {
        toast.error("Error removing category");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Product Categories</h2>
           <p className="text-gray-500">Organize your products into groups.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>{showForm ? "Close Form" : "New Category"}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-300">
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  name="name"
                  className="input"
                  placeholder="e.g. Beverages"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                <div className="relative">
                  <input
                    type="text"
                    name="image"
                    className="input pl-10"
                    placeholder="https://icon-link.png"
                    value={formData.image}
                    onChange={handleInputChange}
                  />
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                </div>
              </div>
                <button type="submit" className="btn btn-primary h-11" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Category"}
                </button>
              <div className="md:col-span-3">
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                 <input
                  type="text"
                  name="description"
                  className="input"
                  placeholder="Short description..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>)
        ) : categories.map((cat) => (
          <div key={cat._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-primary/20 transition-all group">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-secondary-light rounded-2xl flex items-center justify-center p-3">
                 <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{cat.name}</h4>
                <p className="text-xs text-gray-500">{cat.description || "No description"}</p>
              </div>
            </div>
            <button 
              onClick={() => deleteHandler(cat._id)}
              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;
