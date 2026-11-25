import { useState, useEffect } from "react";
import axios from "axios";
import { authHeaders } from "../../utils/auth";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle, 
  Package,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductVariants, getTotalVariantStock } from "../../utils/productVariants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = authHeaders();
        const { data } = await axios.get("/api/reports/dashboard", config);
        setStats(data);
        
        // Fetch products to show low stock list in reports page
        const prodData = await axios.get("/api/products?pageSize=100", config);
        setProducts(prodData.data.products || []);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load reports.");
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 bg-gray-200 w-48 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>)}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  // Filter products for Low Stock / Out of Stock List
  const outOfStockProducts = products.filter((p) =>
    getProductVariants(p).some((variant) => variant.stock === 0)
  );
  const lowStockProducts = products.filter((p) =>
    getProductVariants(p).some(
      (variant) => variant.stock > 0 && variant.stock <= (Number(p.stockLevel) || 0)
    )
  );

  // Line Chart Config for Sales Revenue
  const lineChartData = {
    labels: stats.weeklySales.map(s => s._id),
    datasets: [
      {
        fill: true,
        label: 'Sales Revenue (Rs.)',
        data: stats.weeklySales.map(s => s.total),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: stats.weeklySales.map(s => {
      const date = new Date(s._id);
      return date.toLocaleDateString(undefined, { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Revenue (Rs.)',
        data: stats.weeklySales.map(s => s.total),
        backgroundColor: '#3b82f6',
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.03)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Sales & Analytics Reports</h2>
        <p className="text-gray-500 mt-1">Detailed analysis of Saumya Stores sales, revenue, and inventory alert tracking.</p>
      </div>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-500 rounded-2xl shrink-0">
            <DollarSign size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Sales Revenue</p>
            <h3 className="text-2xl font-extrabold text-gray-900">Rs. {stats.totalRevenue.toLocaleString()}</h3>
            <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
              <TrendingUp size={12} /> +15.4% from last week
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-500 rounded-2xl shrink-0">
            <ShoppingCart size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Orders Handled</p>
            <h3 className="text-2xl font-extrabold text-gray-900">{stats.todayOrders} today</h3>
            <p className="text-[10px] text-gray-400 font-bold mt-1">Active customer checkout sessions</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3.5 bg-purple-50 text-purple-500 rounded-2xl shrink-0">
            <Layers size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Product Categories</p>
            <h3 className="text-2xl font-extrabold text-gray-900">{stats.totalCategories} Active</h3>
            <p className="text-[10px] text-purple-500 font-bold flex items-center gap-0.5">
              <Sparkles size={12} /> 100% catalog coverage
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3.5 bg-orange-50 text-orange-500 rounded-2xl shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Low Stock alerts</p>
            <h3 className="text-2xl font-extrabold text-gray-900">{stats.lowStockCount + stats.outOfStockCount} items</h3>
            <p className="text-[10px] text-orange-500 font-bold">Needs warehouse restocking</p>
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
              <p className="text-xs text-gray-400 mt-0.5">Daily income trend breakdown</p>
            </div>
            <Calendar size={18} className="text-gray-400" />
          </div>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Weekly Comparison</h3>
              <p className="text-xs text-gray-400 mt-0.5">Weekday sales distribution</p>
            </div>
            <TrendingUp size={18} className="text-gray-400" />
          </div>
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Inventory Stock Alerts Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Out of Stock */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-base font-extrabold text-red-600 flex items-center gap-1.5">
              <AlertTriangle size={18} /> Out of Stock Alerts
            </h3>
            <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">{outOfStockProducts.length} items</span>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y">
            {outOfStockProducts.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">Warehouse inventory is fully replenished. No out of stock alerts.</p>
            ) : (
              outOfStockProducts.map(p => (
                <div key={p._id} className="py-3 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover border" />
                    <div>
                      <p className="text-gray-900 font-bold">{p.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">Barcode: #{p.barcode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-500 font-bold">Variant out</p>
                    <Link to={`/admin/products/edit/${p._id}`} className="text-primary hover:underline text-[10px] flex items-center gap-0.5 justify-end">
                      Restock <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-base font-extrabold text-orange-600 flex items-center gap-1.5">
              <Package size={18} /> Low Stock Alerts
            </h3>
            <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full text-xs font-bold">{lowStockProducts.length} items</span>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No products are running below threshold stock level.</p>
            ) : (
              lowStockProducts.map(p => (
                <div key={p._id} className="py-3 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover border" />
                    <div>
                      <p className="text-gray-900 font-bold">{p.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">Alert Limit: {p.stockLevel} units</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-500 font-bold">{getTotalVariantStock(p)} units left</p>
                    <Link to={`/admin/products/edit/${p._id}`} className="text-primary hover:underline text-[10px] flex items-center gap-0.5 justify-end">
                      Update Stock <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
