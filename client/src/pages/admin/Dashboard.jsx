import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { authHeaders } from "../../utils/auth";
import { 
  DollarSign, 
  Package, 
  Users, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/api/reports/dashboard", authHeaders());
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats", error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>)}
      </div>
      <div className="h-96 bg-gray-200 rounded-2xl"></div>
    </div>;
  }

  const chartData = {
    labels: stats.weeklySales.map(s => s._id),
    datasets: [
      {
        fill: true,
        label: 'Sales Revenue (Rs.)',
        data: stats.weeklySales.map(s => s.total),
        borderColor: '#27ae60',
        backgroundColor: 'rgba(39, 174, 96, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const cards = [
    { 
      title: "Total Revenue", 
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`, 
      icon: <DollarSign className="text-emerald-600" />, 
      color: "bg-emerald-50",
      trend: "+12.5%",
      isUp: true
    },
    { 
      title: "Total Orders", 
      value: stats.todayOrders, 
      subtitle: "Orders today",
      icon: <ShoppingCart className="text-blue-600" />, 
      color: "bg-blue-50",
      trend: "+5.1%",
      isUp: true
    },
    { 
      title: "Active Customers", 
      value: stats.totalCustomers, 
      icon: <Users className="text-purple-600" />, 
      color: "bg-purple-50",
      trend: "+2.4%",
      isUp: true
    },
    { 
      title: "Total Products", 
      value: stats.totalProducts, 
      icon: <Package className="text-orange-600" />, 
      color: "bg-orange-50",
      trend: "-0.5%",
      isUp: false
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div className="space-y-4">
              <div className={`p-3 rounded-xl inline-block ${card.color}`}>
                {React.cloneElement(card.icon, { size: 24 })}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
              </div>
              <div className={`flex items-center text-xs font-bold ${card.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                {card.isUp ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {card.trend}
                <span className="text-gray-400 font-normal ml-1">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Sales Analytics</h3>
                <p className="text-sm text-gray-500">Revenue trends for the past 7 days</p>
              </div>
              <select className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-bold text-gray-600 focus:ring-0">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
           </div>
           <div className="h-80">
              <Line data={chartData} options={chartOptions} />
           </div>
        </div>

        {/* Action Needed / Stock Alerts */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-8">Inventory Alerts</h3>
           <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                 <div className="flex items-center space-x-4">
                    <div className="p-2 bg-red-500 text-white rounded-lg">
                       <AlertTriangle size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-red-900">Out of Stock</p>
                       <p className="text-xs text-red-600">{stats.outOfStockCount} products need attention</p>
                    </div>
                 </div>
                 <Link to="/admin/products" className="text-red-700 hover:underline"><ChevronRight size={20} /></Link>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
                 <div className="flex items-center space-x-4">
                    <div className="p-2 bg-orange-500 text-white rounded-lg">
                       <TrendingUp size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-orange-900">Low Stock</p>
                       <p className="text-xs text-orange-600">{stats.lowStockCount} items below threshold</p>
                    </div>
                 </div>
                 <Link to="/admin/products" className="text-orange-700 hover:underline"><ChevronRight size={20} /></Link>
              </div>

              <div className="pt-4">
                 <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider opacity-50">Quick Actions</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <Link to="/admin/products/add" className="p-4 bg-gray-50 rounded-2xl text-center hover:bg-primary/10 transition-colors">
                       <Package className="mx-auto mb-2 text-primary" size={24} />
                       <span className="text-xs font-bold text-gray-700">Add Product</span>
                    </Link>
                    <Link to="/admin/orders" className="p-4 bg-gray-50 rounded-2xl text-center hover:bg-primary/10 transition-colors">
                       <ShoppingCart className="mx-auto mb-2 text-primary" size={24} />
                       <span className="text-xs font-bold text-gray-700">View Orders</span>
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Helper for ChevronRight since it's used in nested links
const ChevronRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default Dashboard;
