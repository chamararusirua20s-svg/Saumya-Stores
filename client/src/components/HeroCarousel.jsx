import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShieldCheck, Truck, Clock } from "lucide-react";
import { fetchHomepageContent, resolveHomepageImage } from "../utils/homeContentStorage";

const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  const loadSlides = async () => {
    const data = await fetchHomepageContent();
    setSlides((data.heroSlides || []).filter((slide) => slide.active !== false));
    setCurrent(0);
  };

  useEffect(() => {
    loadSlides();
    window.addEventListener("homepage-content-updated", loadSlides);
    return () => {
      window.removeEventListener("homepage-content-updated", loadSlides);
    };
  }, []);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    resetTimeout();
    timeoutRef.current = setTimeout(nextSlide, 5000);
    return () => {
      resetTimeout();
    };
  }, [current, slides]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  if (slides.length === 0) {
    return (
      <div className="container-custom py-4">
        <div className="h-[420px] rounded-3xl skeleton-box w-full" />
      </div>
    );
  }

  return (
    <section className="container-custom pt-4 sm:pt-6">
      <div className="relative w-full h-[460px] sm:h-[520px] md:h-[560px] rounded-3xl overflow-hidden shadow-xl group border border-emerald-950/10">
        {/* Slides Container */}
        <div className="relative w-full h-full">
          {slides.map((slide, idx) => {
            const isActive = idx === current;
            return (
              <div
                key={slide.id || idx}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Background Image with Gradient Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms]"
                  style={{
                    backgroundImage: `url(${resolveHomepageImage(slide.bg)})`,
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#14532D]/95 via-[#14532D]/75 to-transparent sm:to-black/30" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full text-white px-6 sm:px-12 md:px-16">
                    <div className="max-w-xl space-y-5 sm:space-y-6">
                      {/* Badge */}
                      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-amber-400 text-gray-950 text-xs font-black uppercase tracking-wider rounded-full shadow-lg">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{slide.badge || "Saumya Stores Special"}</span>
                      </div>

                      {/* Title & Subtitle */}
                      <div className="space-y-2">
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
                          {slide.title}
                        </h1>
                        <p className="text-base sm:text-xl font-medium text-emerald-100/90 leading-relaxed">
                          {slide.subtitle}
                        </p>
                      </div>

                      {/* Offer Pill & CTA */}
                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <div className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-lg font-black text-lg sm:text-xl transform -rotate-1">
                          {slide.offer}
                        </div>

                        <Link
                          to={slide.link || "/shop"}
                          className="btn bg-[#16A34A] hover:bg-emerald-600 text-white px-7 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-emerald-900/30 flex items-center space-x-2 transition-all hover:scale-105"
                        >
                          <span>Shop Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>

                      {/* Mini Trust Features */}
                      <div className="flex flex-wrap items-center gap-4 pt-4 text-[11px] sm:text-xs text-emerald-200/90 font-bold border-t border-white/10">
                        <span className="flex items-center space-x-1">
                          <Truck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Same-Day Islandwide Delivery</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>100% Quality Freshness Guaranteed</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-25 flex space-x-2.5 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === current ? "bg-amber-400 w-8" : "bg-white/40 hover:bg-white/70 w-2.5"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
