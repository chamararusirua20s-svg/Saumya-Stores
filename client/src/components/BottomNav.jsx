import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Grid, Search, ShoppingBag, User } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { AuthModalContext } from "../context/AuthModalContext";

const BottomNav = ({ onOpenCategories, onOpenSearch }) => {
  const location = useLocation();
  const { totalItemsCount, setIsCartDrawerOpen } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { requireAuth } = useContext(AuthModalContext);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            isActive("/") || isActive("/home") ? "text-[#16A34A] font-bold" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Home</span>
        </Link>

        {/* Categories */}
        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            isActive("/shop") ? "text-[#16A34A] font-bold" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-1">Categories</span>
        </Link>

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-gray-500 hover:text-gray-800 transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-1">Search</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => requireAuth(() => setIsCartDrawerOpen(true), "/cart")}
          className="relative flex flex-col items-center justify-center py-1 px-2 rounded-xl text-gray-500 hover:text-[#16A34A] transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#16A34A] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {totalItemsCount > 99 ? "99+" : totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">Cart</span>
        </button>

        {/* Account */}
        <Link
          to={user ? (user.role === "admin" ? "/admin" : "/my-orders") : "/login"}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            isActive("/login") || isActive("/my-orders") || isActive("/admin")
              ? "text-[#16A34A] font-bold"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1">{user ? "Account" : "Login"}</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
