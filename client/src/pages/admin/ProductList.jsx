import { useState, useEffect } from "react";
import axios from "axios";
import { authHeaders } from "../../utils/auth";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Package,
  Barcode
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getPriceRange, getProductVariants, getTotalVariantStock } from "../../utils/productVariants";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/products?keyword=${keyword}&pageNumber=${page}`);
      setProducts(data.products);
      setPages(data.pages);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [keyword, page]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/api/products/${id}`, authHeaders());
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Product Management</h2>
          <p className="text-gray-500 mt-1">Manage your inventory, prices and stock levels.</p>
        </div>
        <Link to="/admin/products/add" className="btn btn-primary flex items-center space-x-2 px-6 py-3 self-start">
          <Plus size={20} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by name, brand or barcode..."
            className="input pl-11 h-11"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        
        <div className="flex items-center space-x-2">
           <button className="btn btn-secondary flex items-center space-x-2 text-sm">
             <Barcode size={18} />
             <span>Scan Barcode</span>
           </button>
           <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
           <span className="text-sm font-medium text-gray-500">{products.length} Products shown</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Product</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Pricing</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-4 h-20 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : products.length > 0 ? (
                products.map((product) => {
                  const variants = getProductVariants(product);
                  const totalStock = getTotalVariantStock(product);
                  const priceRange = getPriceRange(product);

                  return (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover border" />
                        <div className="overflow-hidden">
                          <p className="font-bold text-gray-900 truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-gray-400 font-mono tracking-tighter">#{product.barcode}</p>
                          <p className="text-[10px] text-primary font-black uppercase tracking-wider">
                            {variants.length} {variants.length === 1 ? "variant" : "variants"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-secondary-light text-primary text-xs font-bold rounded-full">
                        {product.category?.name || "Grocery"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900">
                          {priceRange.same
                            ? `Rs. ${priceRange.min.toFixed(2)}`
                            : `Rs. ${priceRange.min.toFixed(2)} - ${priceRange.max.toFixed(2)}`}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {variants.length > 1 ? "Multiple sizes" : variants[0].name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              totalStock === 0 ? 'bg-red-500' : totalStock <= product.stockLevel ? 'bg-orange-500' : 'bg-primary'
                            }`}
                            style={{ width: `${Math.min(100, (totalStock / 50) * 100)}%` }}
                          ></div>
                        </div>
                        <p className={`text-xs font-bold ${
                          totalStock === 0 ? 'text-red-500' : totalStock <= product.stockLevel ? 'text-orange-500' : 'text-gray-500'
                        }`}>
                          {totalStock} units {totalStock === 0 ? '(Out)' : totalStock <= product.stockLevel ? '(Low)' : ''}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end items-center space-x-2">
                          <Link to={`/product/${product._id}`} target="_blank" className="p-2 text-gray-400 hover:text-primary transition-colors">
                            <ExternalLink size={18} />
                          </Link>
                          <Link to={`/admin/products/edit/${product._id}`} className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                            <Edit size={18} />
                          </Link>
                          <button onClick={() => deleteHandler(product._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                       <div className="p-4 bg-gray-50 rounded-full">
                         <Package size={40} className="text-gray-300" />
                       </div>
                       <p className="text-gray-500 font-medium">No products found in the database.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="p-6 bg-gray-50 flex items-center justify-between">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex space-x-2">
               {[...Array(pages)].map((_, i) => (
                 <button 
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                    page === i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                 >
                   {i + 1}
                 </button>
               ))}
            </div>
            <button 
              disabled={page === pages}
              onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
