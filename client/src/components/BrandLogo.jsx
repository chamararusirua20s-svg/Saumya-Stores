import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/saumya-stores-logo.png";
import cartSymbolImg from "../assets/cart_symbol.png";

/**
 * Reusable BrandLogo component for Saumya Stores.
 * 
 * Supports:
 * - variant: "default" | "symbol" | "card" (wrapped in white pill/card for dark backgrounds)
 * - size: "sm" | "md" | "lg" | "xl" | "header" | "footer"
 * - href: optional link destination (defaults to "/") - set null for non-link
 * - className: wrapper styling
 * - imgClassName: image-specific styling
 */
const BrandLogo = ({
  variant = "default",
  size = "md",
  href = "/",
  alt = "Saumya Stores",
  className = "",
  imgClassName = "",
}) => {
  // Size presets optimized for the horizontal 3.7:1 logo
  const sizeClasses = {
    sm: "h-7 sm:h-8 w-auto max-w-[130px] sm:max-w-[150px]",
    header: "h-9 sm:h-11 md:h-12 w-auto max-w-[160px] sm:max-w-[190px] md:max-w-[210px]",
    md: "h-10 sm:h-12 w-auto max-w-[180px] sm:max-w-[210px]",
    lg: "h-12 sm:h-14 md:h-16 w-auto max-w-[210px] sm:max-w-[240px]",
    xl: "h-16 sm:h-20 w-auto max-w-[260px] sm:max-w-[300px]",
    footer: "h-10 sm:h-11 w-auto max-w-[170px] sm:max-w-[190px]",
    symbol: "h-9 w-9 object-contain",
  };

  const imageSrc = variant === "symbol" ? cartSymbolImg : logoImg;
  const resolvedSize = sizeClasses[size] || size;

  const content = (
    <div
      className={`inline-flex items-center justify-center transition-all ${
        variant === "card"
          ? "bg-white px-3.5 py-1.5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md"
          : ""
      } ${className}`}
    >
      <img
        src={imageSrc}
        alt={alt}
        className={`object-contain transition-transform duration-200 ${
          variant === "symbol" ? sizeClasses.symbol : resolvedSize
        } ${imgClassName}`}
        style={{ imageRendering: "auto" }}
        loading="eager"
      />
    </div>
  );

  if (href) {
    return (
      <Link
        to={href}
        className="inline-flex items-center shrink-0 group focus:outline-none"
        aria-label="Saumya Stores – Home"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default BrandLogo;
