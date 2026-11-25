import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ShoppingBag, ShieldCheck, Truck, Clock, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="container-custom">
        {/* Top Features Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-gray-800 text-xs">
          <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-gray-800/40">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#16A34A] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Free Islandwide Delivery</h5>
              <p className="text-gray-400 mt-0.5">On all orders above Rs. 5,000</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-gray-800/40">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#16A34A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">100% Quality Freshness</h5>
              <p className="text-gray-400 mt-0.5">Farm fresh or replacement guarantee</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-gray-800/40">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#16A34A] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Open 7 Days a Week</h5>
              <p className="text-gray-400 mt-0.5">7:00 AM - 10:00 PM Daily</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-gray-800/40">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#16A34A] flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Local Customer Support</h5>
              <p className="text-gray-400 mt-0.5">+94 77 2434 641</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#14532D] flex items-center justify-center shadow-md">
                <ShoppingBag className="text-white w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white leading-none">
                  Saumya<span className="text-[#16A34A]">Stores</span>
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                  Supermarket & Fresh Mart
                </span>
              </div>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Saumya Stores is your premier local supermarket platform in Sri Lanka.
              Delivering the freshest farm-picked vegetables, tropical fruits, premium samba rice,
              dairy, bakery, and trusted household goods directly to your doorstep.
            </p>
            <div className="text-xs text-gray-400 space-y-1.5 pt-2">
              <p className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>No 54/2 Saumya Stores, Haputhale Road, Wellawaya, Sri Lanka</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#16A34A] shrink-0" />
                <a href="tel:+94772434641" className="hover:text-white transition-colors">+94 77 2434 641</a>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>support@saumyastores.com</span>
              </p>
            </div>
          </div>

          {/* Grocery Departments */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4">
              Departments
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/shop?category=Vegetables" className="hover:text-[#16A34A] transition-colors">🥦 Fresh Vegetables</Link></li>
              <li><Link to="/shop?category=Fruits" className="hover:text-[#16A34A] transition-colors">🍎 Fresh Fruits</Link></li>
              <li><Link to="/shop?category=Rice" className="hover:text-[#16A34A] transition-colors">🌾 Rice & Grains</Link></li>
              <li><Link to="/shop?category=Dairy" className="hover:text-[#16A34A] transition-colors">🥛 Dairy & Milk</Link></li>
              <li><Link to="/shop?category=Bakery" className="hover:text-[#16A34A] transition-colors">🍞 Bakery & Breads</Link></li>
              <li><Link to="/shop?category=Beverages" className="hover:text-[#16A34A] transition-colors">🥤 Beverages & Juices</Link></li>
              <li><Link to="/shop?category=Snacks" className="hover:text-[#16A34A] transition-colors">🍿 Biscuits & Snacks</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/shop" className="hover:text-[#16A34A] transition-colors">All Grocery Products</Link></li>
              <li><Link to="/shop?deals=true" className="hover:text-[#16A34A] transition-colors">Today's Special Deals</Link></li>
              <li><Link to="/cart" className="hover:text-[#16A34A] transition-colors">Shopping Cart</Link></li>
              <li><Link to="/my-orders" className="hover:text-[#16A34A] transition-colors">Track My Orders</Link></li>
              <li><Link to="/shipping" className="hover:text-[#16A34A] transition-colors">Delivery Coverage</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><span className="hover:text-white cursor-pointer">Store Pickup Guide</span></li>
              <li><span className="hover:text-white cursor-pointer">Freshness Guarantee</span></li>
              <li><span className="hover:text-white cursor-pointer">Payment Options & COD</span></li>
              <li><span className="hover:text-white cursor-pointer">Return & Refund Policy</span></li>
              <li><span className="hover:text-white cursor-pointer">Terms & Conditions</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Saumya Stores Management System. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="text-[11px] font-semibold text-gray-400">Accepted Payments:</span>
            <div className="flex items-center space-x-3 opacity-75">
              <span className="px-2 py-0.5 bg-gray-800 rounded font-black text-[10px] text-white">VISA</span>
              <span className="px-2 py-0.5 bg-gray-800 rounded font-black text-[10px] text-white">MasterCard</span>
              <span className="px-2 py-0.5 bg-gray-800 rounded font-black text-[10px] text-emerald-400">Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
