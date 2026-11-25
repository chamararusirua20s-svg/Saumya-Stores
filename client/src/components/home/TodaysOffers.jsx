import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, ShoppingBag } from "lucide-react";
import { fetchPublicOffers } from "../../utils/offerApi";

const CountdownTimer = ({ endDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(endDate + "T23:59:59") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    const label = interval === "days" ? "D" : interval === "hours" ? "H" : interval === "minutes" ? "M" : "S";
    timerComponents.push(
      <div key={interval} className="flex flex-col items-center px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-xl min-w-[42px]">
        <span className="text-sm font-black text-white leading-none">{String(timeLeft[interval]).padStart(2, "0")}</span>
        <span className="text-[8px] font-black text-white/80 mt-0.5 uppercase">{label}</span>
      </div>
    );
  });

  return (
    <div className="flex items-center space-x-1.5">
      {timerComponents.length ? (
        <>
          <Clock className="w-4 h-4 text-accent animate-pulse mr-1" />
          {timerComponents}
        </>
      ) : (
        <span className="text-[10px] bg-red-600 text-white font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider animate-pulse">
          Offer Expired
        </span>
      )}
    </div>
  );
};

const TodaysOffers = () => {
  const [offers, setOffers] = useState([]);
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);

  const loadOffers = async () => {
    try {
      const data = await fetchPublicOffers();
      setOffers(data.filter((offer) => offer.active));
      setCurrent(0);
    } catch (error) {
      console.error("Error loading offers:", error);
    }
  };

  useEffect(() => {
    loadOffers();
    window.addEventListener("homepage-content-updated", loadOffers);
    return () => {
      window.removeEventListener("homepage-content-updated", loadOffers);
    };
  }, []);

  useEffect(() => {
    if (offers.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [offers.length]);

  if (offers.length === 0) return null;

  const goNext = () => setCurrent((prev) => (prev + 1) % offers.length);
  const goPrev = () => setCurrent((prev) => (prev === 0 ? offers.length - 1 : prev - 1));

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      delta > 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
  };

  return (
    <section className="container-custom py-12">
      <div className="text-center md:text-left mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Today's Special Offers</h2>
        <p className="text-gray-500 mt-2">Get fresh savings on our limited-time premium specials.</p>
      </div>

      <div className="relative group">
        <div className="overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {offers.map((offer) => {
              const isExpired = new Date(offer.endDate + "T23:59:59") < new Date();
              return (
                <div key={offer.id} className="min-w-full">
                  <div className="group relative overflow-hidden bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row h-full min-h-[220px]">
                    <div className="sm:w-2/5 relative h-52 sm:h-auto overflow-hidden bg-gray-50 flex-shrink-0">
                      <picture>
                        <source media="(max-width: 640px)" srcSet={offer.mobileBanner || offer.image} />
                        <img
                          src={offer.desktopBanner || offer.image}
                          alt={offer.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </picture>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg">
                        {offer.discount}% OFF
                      </div>
                    </div>

                    <div className="p-6 sm:w-3/5 flex flex-col justify-between flex-grow space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight leading-snug group-hover:text-primary transition-colors">
                          {offer.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                          {offer.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
                        {offer.endDate && !isExpired && (
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Expires in:</span>
                            <CountdownTimer endDate={offer.endDate} />
                          </div>
                        )}

                        <Link
                          to="/shop"
                          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md shadow-primary/10 hover:shadow-lg active:scale-95 transition-all duration-300"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>{offer.buttonText || "Shop Now"}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {offers.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous Offer"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/95 text-gray-900 rounded-full shadow-xl hover:bg-primary hover:text-white transition-all duration-300 border border-gray-100"
            >
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </button>
            <button
              onClick={goNext}
              aria-label="Next Offer"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/95 text-gray-900 rounded-full shadow-xl hover:bg-primary hover:text-white transition-all duration-300 border border-gray-100"
            >
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default TodaysOffers;
