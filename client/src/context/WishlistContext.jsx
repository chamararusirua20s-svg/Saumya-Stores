import React, { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem("saumya_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("saumya_wishlist", JSON.stringify(wishlistItems));
    } catch (e) {
      console.error("Failed to save wishlist:", e);
    }
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    if (!product || !product._id) return;
    const exists = wishlistItems.some((item) => item._id === product._id);

    if (exists) {
      setWishlistItems((prev) => prev.filter((item) => item._id !== product._id));
      toast.success(`${product.name} removed from wishlist`, {
        icon: "💔",
        id: `wishlist-${product._id}`,
      });
    } else {
      setWishlistItems((prev) => [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          image: product.image,
          price: product.sellingPrice || product.price,
          discount: product.discount || 0,
          brand: product.brand,
          category: product.category,
          quantity: product.quantity,
          variants: product.variants,
        },
      ]);
      toast.success(`${product.name} saved to wishlist!`, {
        icon: "❤️",
        id: `wishlist-${product._id}`,
      });
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
