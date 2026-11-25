import React from "react";
import { Leaf, Truck, ShieldCheck, BadgePercent, Headphones, Sparkles, Store, MapPin } from "lucide-react";

const features = [
  {
    id: 1,
    icon: <Leaf className="w-6 h-6" />,
    title: "100% Farm Fresh",
    description: "Picked daily from Nuwara Eliya and local Uva farmers to bring you crisp vegetables and juicy fruits.",
    color: "text-[#16A34A] bg-emerald-50 border-emerald-100",
  },
  {
    id: 2,
    icon: <Truck className="w-6 h-6" />,
    title: "Fast Islandwide Delivery",
    description: "45-minute express delivery in Wellawaya & same/next day temperature-controlled islandwide courier.",
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    id: 3,
    icon: <Store className="w-6 h-6" />,
    title: "Store Pickup Available",
    description: "Order online and collect your packed basket free from Saumya Stores Wellawaya within 30 minutes.",
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    id: 4,
    icon: <BadgePercent className="w-6 h-6" />,
    title: "Supermarket Prices & Deals",
    description: "Enjoy Food City competitive prices with daily bundle promotions and special discounts.",
    color: "text-orange-600 bg-orange-50 border-orange-100",
  },
  {
    id: 5,
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Secure Payments & COD",
    description: "Pay securely online with Visa/Mastercard, or pay with Cash on Delivery / Store Pickup.",
    color: "text-purple-600 bg-purple-50 border-purple-100",
  },
  {
    id: 6,
    icon: <Headphones className="w-6 h-6" />,
    title: "Dedicated Local Helpline",
    description: "Our friendly Sri Lankan customer support team is just a call away at +94 77 2434 641.",
    color: "text-teal-600 bg-teal-50 border-teal-100",
  },
];

const WhyShopWithUs = () => {
  return (
    <section className="bg-emerald-50/50 py-14 sm:py-16 border-y border-emerald-100/70">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#16A34A] bg-emerald-100/80 px-4 py-1.5 rounded-full inline-block">
            The Saumya Difference
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight mt-3">
            Why Shop at Saumya Stores
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            Sri Lanka’s trusted local supermarket committed to freshness, reliability, and affordable prices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex items-start space-x-4 bg-white border border-gray-100 p-6 rounded-3xl shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div
                className={`p-3.5 rounded-2xl border transition-colors duration-300 group-hover:bg-[#16A34A] group-hover:text-white group-hover:border-transparent shrink-0 ${feature.color}`}
              >
                {feature.icon}
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-gray-900 text-base group-hover:text-[#16A34A] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyShopWithUs;
