import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, Package } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import heroImg from "../assets/hero.png";

const Landing = () => {
  const { user } = useContext(AuthContext);

  // If user is already logged in, redirect them to the protected home page
  if (user) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-secondary-light overflow-hidden">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center py-12 md:py-24">
            <div className="md:w-1/2 space-y-8 z-10">
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary font-bold rounded-full text-xs uppercase tracking-wider">
                Saumya Stores Exclusive
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
                Quality Groceries <br />
                <span className="text-primary italic">Delivered</span> to You
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Join our exclusive members-only grocery club. Sign in to browse fresh products, discover unbeatable prices, and enjoy fast delivery directly to your door.
              </p>
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn btn-primary px-8 py-4 text-lg flex items-center space-x-2">
                  <UserIcon />
                  <span>Login to Shop</span>
                </Link>
                <Link to="/register" className="btn btn-secondary px-8 py-4 text-lg">
                  Create Account
                </Link>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <p className="text-sm text-gray-500 font-medium border-l-4 border-primary pl-4 py-1">
                  <span className="block text-gray-900 font-bold">10k+ Members</span>
                  Exclusive shopping experience
                </p>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0 relative">
               <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
               <img 
                src={heroImg} 
                alt="Fresh Groceries" 
                className="relative z-10 w-full h-auto rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join Us?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Becoming a member gives you access to premium features, direct-to-door delivery, and special offers you won't find anywhere else.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: <Package className="w-8 h-8" />, title: "Exclusive Products", desc: "Access to members-only premium groceries and fresh farm produce." },
            { icon: <ShieldCheck className="w-8 h-8" />, title: "Secure Member Platform", desc: "Your data and payments are 100% protected on our secure network." },
            { icon: <Truck className="w-8 h-8" />, title: "Priority Delivery", desc: "Members receive priority fast delivery directly to their doorstep." },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="p-4 bg-primary/10 text-primary rounded-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom pt-8">
        <div className="bg-gray-900 rounded-3xl p-12 relative overflow-hidden text-center text-white">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to start shopping?
            </h2>
            <p className="text-gray-400 text-lg">
              Create your account today in less than a minute and unlock the full Saumya Stores experience.
            </p>
            <div className="pt-4">
              <Link to="/register" className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg">
                <span>Create Free Account</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default Landing;
