import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../ProductCard";

const ProductSlider = ({ products = [], loading = false }) => {
  const sliderRef = useRef(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftBtn(scrollLeft > 10);
      setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, [products]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="relative w-full py-4">
        <div className="flex space-x-4 sm:space-x-6 overflow-x-auto hide-scrollbar">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-box rounded-3xl h-80 w-64 sm:w-72 shrink-0"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 font-medium text-xs">
        No products available in this section
      </div>
    );
  }

  return (
    <div className="relative w-full group py-2">
      {/* Left scroll button */}
      {showLeftBtn && (
        <button
          onClick={() => scroll("left")}
          className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white text-gray-800 rounded-full shadow-xl hover:bg-[#16A34A] hover:text-white transition-all duration-200 border border-gray-100 hover:scale-110 active:scale-95"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Slider Container */}
      <div
        ref={sliderRef}
        onScroll={checkScrollPosition}
        className="flex space-x-3.5 sm:space-x-5 overflow-x-auto scroll-smooth hide-scrollbar pb-4 pt-1 px-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="w-[230px] sm:w-[270px] shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Right scroll button */}
      {showRightBtn && (
        <button
          onClick={() => scroll("right")}
          className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white text-gray-800 rounded-full shadow-xl hover:bg-[#16A34A] hover:text-white transition-all duration-200 border border-gray-100 hover:scale-110 active:scale-95"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ProductSlider;
