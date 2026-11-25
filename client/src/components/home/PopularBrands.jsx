import React from "react";
import { Link } from "react-router-dom";
import { Award, ArrowRight } from "lucide-react";

const LOCAL_BRANDS = [
  {
    name: "Munchee",
    category: "Biscuits & Confectionery",
    origin: "Ceylon Biscuits Ltd",
    badge: "Sri Lanka's #1",
    color: "from-amber-500 to-yellow-600",
  },
  {
    name: "Maliban",
    category: "Biscuits & Treats",
    origin: "Maliban Biscuit Manufactories",
    badge: "Heritage Brand",
    color: "from-blue-600 to-indigo-700",
  },
  {
    name: "Elephant House",
    category: "Ice Creams & Beverages",
    origin: "Ceylon Cold Stores",
    badge: "Since 1866",
    color: "from-red-600 to-rose-700",
  },
  {
    name: "Anchor",
    category: "Dairy & Milk Powder",
    origin: "Fonterra Brands",
    badge: "Trusted Dairy",
    color: "from-sky-500 to-blue-600",
  },
  {
    name: "Kotmale",
    category: "Fresh Milk & Cheese",
    origin: "Cargills Quality Dairies",
    badge: "100% Sri Lankan",
    color: "from-emerald-500 to-green-700",
  },
  {
    name: "Kist",
    category: "Jams, Sauces & Juices",
    origin: "Cargills Agrifoods",
    badge: "Farm Fresh Fruit",
    color: "from-orange-500 to-amber-600",
  },
  {
    name: "MD",
    category: "Canned Foods & Cordials",
    origin: "Marketing Department Brands",
    badge: "Authentic Taste",
    color: "from-red-500 to-amber-700",
  },
  {
    name: "Dilmah",
    category: "Pure Ceylon Tea",
    origin: "Single Origin Tea",
    badge: "Finest Ceylon",
    color: "from-teal-600 to-emerald-800",
  },
  {
    name: "Harischandra",
    category: "Coffee & Noodles",
    origin: "Matara Heritage",
    badge: "Traditional Choice",
    color: "from-yellow-600 to-amber-800",
  },
  {
    name: "Pelwatte",
    category: "Butter, Milk & Ghee",
    origin: "Uva & Southern Fresh",
    badge: "Pure Cow Milk",
    color: "from-cyan-600 to-blue-800",
  },
];

const PopularBrands = () => {
  return (
    <section className="container-custom py-10 sm:py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100/70 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Trusted Supermarket Brands</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Popular Local & International Brands
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Sri Lanka’s most loved household grocery names available fresh at Saumya Stores
          </p>
        </div>

        <Link
          to="/shop"
          className="text-[#16A34A] hover:text-[#14532D] font-bold text-sm flex items-center space-x-1 transition-colors mt-3 sm:mt-0"
        >
          <span>Explore All Brands</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {LOCAL_BRANDS.map((brand, i) => (
          <Link
            key={i}
            to={`/shop?keyword=${encodeURIComponent(brand.name)}`}
            className="group bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full group-hover:bg-emerald-100 group-hover:text-[#16A34A] transition-colors">
                  {brand.badge}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
              </div>

              <h3 className="font-black text-base sm:text-lg text-gray-900 group-hover:text-[#16A34A] transition-colors">
                {brand.name}
              </h3>
              <p className="text-[11px] font-semibold text-gray-500 mt-0.5 truncate">
                {brand.category}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-medium">
              <span className="truncate">{brand.origin}</span>
              <span className="text-[#16A34A] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Shop →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularBrands;
