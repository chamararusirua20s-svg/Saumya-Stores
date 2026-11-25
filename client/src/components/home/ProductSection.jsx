import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../ProductCard";

const ProductSection = ({ title, subtitle, products = [], loading = false }) => {
  if (loading) {
    return (
      <section className="container-custom py-10">
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-4 w-64 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-box rounded-2xl h-80 w-full"></div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="container-custom py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="text-gray-500 mt-1">{subtitle}</p>
        </div>
        <Link
          to="/shop"
          className="text-primary font-bold flex items-center space-x-1 hover:text-primary-dark transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
