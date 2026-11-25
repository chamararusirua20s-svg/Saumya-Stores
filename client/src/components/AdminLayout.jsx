import React, { useContext } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Layers,
  ChevronRight,
  User,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import AdminChangePasswordModal from "./AdminChangePasswordModal";
import BrandLogo from "./BrandLogo";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard /> },
    { name: "Products", path: "/admin/products", icon: <Package /> },
    { name: "Categories", path: "/admin/categories", icon: <Layers /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingCart /> },
    { name: "Customers", path: "/admin/customers", icon: <Users /> },
    { name: "Reports", path: "/admin/reports", icon: <BarChart3 /> },
    { name: "Content Settings", path: "/admin/content", icon: <Settings /> },
    { name: "Backgrounds", path: "/admin/backgrounds", icon: <Package /> },
  ];

  return (
    <div className="flex h-full bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-5 border-b flex flex-col items-center">
          <BrandLogo size="md" />
          <span className="mt-2 text-[10px] uppercase font-black tracking-widest text-[#14532D] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            Admin Portal
          </span>
        </div>
        
       <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-gray-500 hover:bg-secondary-light hover:text-primary"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? "text-white" : "text-gray-400 group-hover:text-primary"}>
                    {React.cloneElement(item.icon, { size: 20 })}
                  </span>
                  <span className="font-semibold">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-6 border-t font-medium">
          <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-xl">
             <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
               <User size={20} />
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
               <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Administrator</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header (Admin Only) */}
        <div className="lg:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50">
           <span className="font-bold text-primary">Admin Panel</span>
           <button onClick={handleLogout} className="text-red-500"><LogOut size={20} /></button>
        </div>
        
        <div className="p-4 md:p-8">
           <Outlet />
        </div>

        {/* First-login Password Change Modal */}
        <AdminChangePasswordModal />
      </main>
    </div>
  );
};

export default AdminLayout;
