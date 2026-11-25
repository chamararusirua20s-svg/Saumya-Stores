import React, { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Shehara Perera",
    role: "Verified Buyer",
    rating: 5,
    text: "Saumya Stores has completely changed how I shop for groceries. The vegetables are always super fresh, and delivery is incredibly prompt. Highly recommended!",
    avatar: "https://i.pravatar.cc/100?img=32"
  },
  {
    id: 2,
    name: "Kasun Silva",
    role: "Loyal Customer",
    rating: 5,
    text: "The selection of dairy and bakery items is excellent. Customer support was very helpful when I needed to update my delivery address. Prices are very reasonable too.",
    avatar: "https://i.pravatar.cc/100?img=12"
  },
  {
    id: 3,
    name: "Amanda Jayawardena",
    role: "Regular Shopper",
    rating: 5,
    text: "Very user-friendly system! Ordering takes less than a minute and tracking my purchases is seamless. The quality of organic fruits is top-notch.",
    avatar: "https://i.pravatar.cc/100?img=47"
  },
  {
    id: 4,
    name: "Roshan Fernando",
    role: "Verified Buyer",
    rating: 5,
    text: "I love the weekend deals and cashback offers. The products are packaged nicely, and the delivery drivers are always professional and polite.",
    avatar: "https://i.pravatar.cc/100?img=68"
  }
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className="container-custom py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full">
          Customer Voice
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mt-4">
          What Our Customers Say
        </h2>
        <p className="text-gray-500 mt-2">
          Don't just take our word for it. Read what our loving members write about us.
        </p>
      </div>

      {/* Slider Layout */}
      <div className="relative max-w-4xl mx-auto bg-white border border-gray-100 p-8 md:p-12 rounded-[32px] shadow-sm hover:shadow-xl transition-shadow duration-300">
        <Quote className="absolute top-8 left-8 text-primary/10 w-24 h-24 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0 relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full scale-110 blur-sm" />
            <img
              src={testimonials[current].avatar}
              alt={testimonials[current].name}
              className="relative w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>

          {/* Testimonial Content */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex justify-center md:justify-start space-x-1">
              {[...Array(testimonials[current].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 text-lg md:text-xl italic leading-relaxed">
              "{testimonials[current].text}"
            </p>
            <div>
              <h4 className="font-extrabold text-gray-900 text-lg">
                {testimonials[current].name}
              </h4>
              <p className="text-xs font-bold text-primary uppercase tracking-wider mt-0.5">
                {testimonials[current].role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center md:justify-end space-x-4 mt-8 md:mt-0">
          <button
            onClick={prevTestimonial}
            aria-label="Previous Testimonial"
            className="p-3 bg-secondary-light hover:bg-primary hover:text-white text-primary rounded-2xl transition-all duration-200 active:scale-95 border border-emerald-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextTestimonial}
            aria-label="Next Testimonial"
            className="p-3 bg-secondary-light hover:bg-primary hover:text-white text-primary rounded-2xl transition-all duration-200 active:scale-95 border border-emerald-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
