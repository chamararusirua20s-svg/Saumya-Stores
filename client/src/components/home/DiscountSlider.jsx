import React, { useEffect, useState } from "react";
import { Sparkles, Tag, Flame, ShieldAlert, BadgePercent, Gift, Truck, Leaf, Award } from "lucide-react";
import { fetchPublicOffers } from "../../utils/offerApi";

const DEFAULT_MARQUEE_ITEMS = [
  {
    id: "dm-1",
    title: "Free Islandwide Delivery",
    subtitle: "Orders over Rs. 5,000",
    description: "Doorstep delivery across Sri Lanka or 1-hr express in Wellawaya",
    icon: <Truck className="w-5 h-5" />,
    bg: "from-[#16A34A] to-[#14532D]",
  },
  {
    id: "dm-2",
    title: "100% Farm Fresh Guarantee",
    subtitle: "Organic & Fresh Daily",
    description: "Directly harvested from upcountry & local Uva farms",
    icon: <Leaf className="w-5 h-5" />,
    bg: "from-emerald-500 to-teal-700",
  },
  {
    id: "dm-3",
    title: "Daily Supermarket Deals",
    subtitle: "Up to 30% OFF",
    description: "Special discounts on Keeri Samba, Spices, Dairy & Biscuits",
    icon: <Flame className="w-5 h-5" />,
    bg: "from-amber-500 to-orange-600",
  },
  {
    id: "dm-4",
    title: "Authentic Local Brands",
    subtitle: "Ceylon Best Quality",
    description: "Maliban, Munchee, Elephant House, Kist, Dilmah & MD",
    icon: <Award className="w-5 h-5" />,
    bg: "from-blue-600 to-indigo-700",
  },
];

const offerTypeMeta = {
  today: { icon: <Sparkles className="w-5 h-5" />, bg: "from-green-500 to-emerald-600" },
  weekend: { icon: <Tag className="w-5 h-5" />, bg: "from-amber-500 to-orange-600" },
  hot: { icon: <Flame className="w-5 h-5" />, bg: "from-red-500 to-rose-600" },
  special: { icon: <BadgePercent className="w-5 h-5" />, bg: "from-cyan-500 to-blue-600" },
  bogo: { icon: <Gift className="w-5 h-5" />, bg: "from-purple-500 to-indigo-600" },
  limited: { icon: <ShieldAlert className="w-5 h-5" />, bg: "from-pink-500 to-rose-600" },
};

const DiscountSlider = () => {
  const [discountItems, setDiscountItems] = useState([]);

  const loadOffers = async () => {
    try {
      const offers = await fetchPublicOffers();
      if (offers && offers.length > 0) {
        setDiscountItems(offers);
      } else {
        setDiscountItems(DEFAULT_MARQUEE_ITEMS);
      }
    } catch {
      setDiscountItems(DEFAULT_MARQUEE_ITEMS);
    }
  };

  useEffect(() => {
    loadOffers();
    window.addEventListener("homepage-content-updated", loadOffers);
    return () => {
      window.removeEventListener("homepage-content-updated", loadOffers);
    };
  }, []);

  const itemsToDisplay = discountItems.length > 0 ? discountItems : DEFAULT_MARQUEE_ITEMS;
  const marqueeItems = [...itemsToDisplay, ...itemsToDisplay];

  return (
    <section className="bg-emerald-50/70 py-4 sm:py-5 border-y border-emerald-100 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-emerald-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-emerald-50 to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {marqueeItems.map((item, index) => {
          const meta = item.icon
            ? { icon: item.icon, bg: item.bg }
            : offerTypeMeta[item.offerType] || offerTypeMeta.special;

          return (
            <div
              key={`${item.id || item._id}-${index}`}
              className="flex items-center space-x-3.5 bg-white border border-gray-100 rounded-2xl shadow-xs p-3.5 mx-3 w-[320px] sm:w-[350px] flex-shrink-0 transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${meta.bg} text-white shadow-xs shrink-0`}>
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">
                  {item.subtitle || item.offerType || "Deal of the Day"}
                </span>
                <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm truncate leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DiscountSlider;
