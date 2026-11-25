import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authHeaders } from "../../utils/auth";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Barcode,
  Calendar,
  Image as ImageIcon,
  Info,
  Package,
  Plus,
  Save,
  Tag,
  Trash2,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import { getProductVariants } from "../../utils/productVariants";

const emptyVariant = () => ({
  name: "",
  sellingPrice: 0,
  buyingPrice: 0,
  stock: 0,
  sku: "",
});

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    category: "",
    brand: "",
    description: "",
    discount: 0,
    stockLevel: 10,
    expiryDate: "",
    image: "",
    variants: [emptyVariant()],
  });

  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", image: "", description: "" });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/categories");
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setFormData({
        name: data.name || "",
        barcode: data.barcode || "",
        category: data.category?._id || data.category || "",
        brand: data.brand || "",
        description: data.description || "",
        discount: data.discount || 0,
        stockLevel: data.stockLevel || 10,
        expiryDate: data.expiryDate ? data.expiryDate.split("T")[0] : "",
        image: data.image || "",
        variants: getProductVariants(data),
      });
      setLoading(false);
    } catch {
      toast.error("Error fetching product");
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
    if (isEdit) fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "category" && value === "__add_new__") {
      setShowAddCategory(true);
      setFormData({ ...formData, category: "" });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleVariantChange = (index, field, value) => {
    const nextVariants = formData.variants.map((variant, variantIndex) =>
      variantIndex === index ? { ...variant, [field]: value } : variant
    );
    setFormData({ ...formData, variants: nextVariants });
  };

  const addVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, emptyVariant()] });
  };

  const removeVariant = (index) => {
    if (formData.variants.length === 1) {
      toast.error("A product needs at least one variant.");
      return;
    }
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, variantIndex) => variantIndex !== index),
    });
  };

  const moveVariant = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= formData.variants.length) return;
    const nextVariants = [...formData.variants];
    [nextVariants[index], nextVariants[targetIndex]] = [nextVariants[targetIndex], nextVariants[index]];
    setFormData({ ...formData, variants: nextVariants });
  };

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const createNewCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      const { data } = await axios.post("/api/categories", newCategory, authHeaders());
      toast.success("Category created");
      await fetchCategories();
      setFormData({ ...formData, category: data._id });
      setNewCategory({ name: "", image: "", description: "" });
      setShowAddCategory(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  const cancelNewCategory = () => {
    setNewCategory({ name: "", image: "", description: "" });
    setShowAddCategory(false);
    setFormData({ ...formData, category: "" });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append("image", file);
    setUploading(true);

    try {
      const uploadConfig = authHeaders();
      uploadConfig.headers["Content-Type"] = "multipart/form-data";
      const { data } = await axios.post("/api/upload", uploadFormData, uploadConfig);

      setFormData({ ...formData, image: data });
      setUploading(false);
      toast.success("Image uploaded!");
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error("Upload failed. Using placeholder.");
      setFormData({ ...formData, image: "https://via.placeholder.com/500?text=Product+Image" });
    }
  };

  const buildPayload = () => {
    const variants = formData.variants.map((variant, index) => ({
      _id: variant._id && !String(variant._id).includes("-default") ? variant._id : undefined,
      name: String(variant.name || "").trim(),
      sellingPrice: Number(variant.sellingPrice) || 0,
      buyingPrice: Number(variant.buyingPrice) || 0,
      stock: Number(variant.stock) || 0,
      sku: String(variant.sku || "").trim(),
      order: index,
    }));

    const invalidVariant = variants.find(
      (variant) => !variant.name || variant.sellingPrice <= 0 || variant.buyingPrice < 0 || variant.stock < 0
    );

    if (invalidVariant) {
      throw new Error("Each variant needs a name, selling price, buying price, and valid stock.");
    }

    const firstVariant = variants[0];

    return {
      ...formData,
      buyingPrice: firstVariant.buyingPrice,
      sellingPrice: firstVariant.sellingPrice,
      quantity: variants.reduce((total, variant) => total + variant.stock, 0),
      stockLevel: Number(formData.stockLevel) || 0,
      discount: Number(formData.discount) || 0,
      variants,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload;
    try {
      payload = buildPayload();
    } catch (error) {
      toast.error(error.message);
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/api/products/${id}`, payload, authHeaders());
        toast.success("Product updated successfully");
      } else {
        await axios.post("/api/products", payload, authHeaders());
        toast.success("Product created successfully");
      }
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
      setLoading(false);
    }
  };

  const totalStock = formData.variants.reduce((total, variant) => total + (Number(variant.stock) || 0), 0);

  if (loading && isEdit) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <Link to="/admin/products" className="p-2 bg-white rounded-xl shadow-sm border hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <p className="text-gray-500">Manage one product with one or many size and price variants.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-4 flex items-center space-x-2">
              <Info size={20} className="text-primary" />
              <span>General Information</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    className="input pl-11"
                    placeholder="e.g. Coca-Cola"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Barcode Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="barcode"
                      className="input pl-11"
                      placeholder="Unique product barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      required
                    />
                    <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="brand"
                      className="input pl-11"
                      placeholder="e.g. Coca-Cola"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                    />
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  className="input min-h-[120px] py-3"
                  placeholder="Provide a detailed description of the product..."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Size & Price Variants</h3>
                <p className="text-sm text-gray-500">Customers must choose one of these options before cart checkout.</p>
              </div>
              <button type="button" onClick={addVariant} className="btn btn-primary flex items-center gap-2 self-start">
                <Plus size={18} />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div key={variant._id || index} className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-gray-900">Variant {index + 1}</p>
                      <p className="text-xs text-gray-500">
                        {variant.name || "New size"} - Rs. {Number(variant.sellingPrice || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveVariant(index, -1)}
                        disabled={index === 0}
                        className="p-2 rounded-lg bg-white border text-gray-500 hover:text-primary disabled:opacity-40"
                        title="Move up"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveVariant(index, 1)}
                        disabled={index === formData.variants.length - 1}
                        className="p-2 rounded-lg bg-white border text-gray-500 hover:text-primary disabled:opacity-40"
                        title="Move down"
                      >
                        <ArrowDown size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="p-2 rounded-lg bg-white border text-gray-500 hover:text-red-500"
                        title="Delete variant"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Variant Name</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="250ml"
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Selling Price</label>
                      <input
                        type="number"
                        className="input"
                        min="0"
                        value={variant.sellingPrice}
                        onChange={(e) => handleVariantChange(index, "sellingPrice", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Buying Price</label>
                      <input
                        type="number"
                        className="input"
                        min="0"
                        value={variant.buyingPrice}
                        onChange={(e) => handleVariantChange(index, "buyingPrice", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Stock</label>
                      <input
                        type="number"
                        className="input"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">SKU Optional</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="SKU"
                        value={variant.sku || ""}
                        onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  className="input"
                  min="0"
                  value={formData.discount}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Alert Level</label>
                <input
                  type="number"
                  name="stockLevel"
                  className="input"
                  min="0"
                  value={formData.stockLevel}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                <div className="relative">
                  <input
                    type="date"
                    name="expiryDate"
                    className="input pl-11"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-4 flex items-center space-x-2">
              <ImageIcon size={20} className="text-primary" />
              <span>Product Image</span>
            </h3>

            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary group">
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-bold shadow-xl">
                        Change Image
                        <input type="file" className="hidden" onChange={uploadFileHandler} />
                      </label>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <Upload className="w-12 h-12 text-gray-300 mx-auto group-hover:text-primary transition-colors" />
                    <p className="text-xs text-gray-500 font-medium">Click or drag to upload image</p>
                  </div>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={uploadFileHandler} />
              </div>
              {uploading && <p className="text-xs text-primary animate-pulse text-center">Uploading image...</p>}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Or Image URL</label>
                <input
                  type="text"
                  name="image"
                  className="input text-xs"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-4">Classification</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                name="category"
                className="input h-11"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a Category</option>
                <option value="__add_new__">+ Add new category...</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {showAddCategory && (
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={handleNewCategoryChange}
                    className="input"
                    placeholder="New category name"
                  />
                  <input
                    type="text"
                    name="image"
                    value={newCategory.image}
                    onChange={handleNewCategoryChange}
                    className="input"
                    placeholder="Image URL (optional)"
                  />
                  <input
                    type="text"
                    name="description"
                    value={newCategory.description}
                    onChange={handleNewCategoryChange}
                    className="input"
                    placeholder="Description (optional)"
                  />
                  <div className="flex space-x-2">
                    <button type="button" onClick={createNewCategory} className="btn btn-primary">Create</button>
                    <button type="button" onClick={cancelNewCategory} className="btn">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-secondary-light p-6 rounded-2xl border border-primary/10">
            <p className="text-primary font-bold text-sm">Variant Summary</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{formData.variants.length} sizes</p>
            <p className="text-xs text-gray-500 font-semibold mt-1">{totalStock} total units in stock</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 text-lg flex items-center justify-center space-x-2 shadow-xl shadow-primary/20"
          >
            <Save size={20} />
            <span>{isEdit ? "Update Product" : "Save Product"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
