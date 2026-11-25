import { createContext, useState, useEffect } from "react";
import { getCartItemId, getProductVariants, getVariantFinalPrice } from "../utils/productVariants";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1, selectedVariant = null, openDrawer = false) => {
    const variants = getProductVariants(product);
    const variant = selectedVariant || product.selectedVariant || (variants.length === 1 ? variants[0] : null);

    if (!variant) {
      throw new Error("Please select a size before adding to cart.");
    }

    const productId = product._id || product.product;
    const variantId = variant._id || variant.name;
    const cartItemId = getCartItemId(productId, variantId);
    const countInStock = Number(variant.stock ?? product.countInStock ?? product.quantity) || 0;
    const safeQty = Math.min(Math.max(Number(qty) || 1, 1), countInStock);
    const price = getVariantFinalPrice(variant, product.discount);
    const existItem = cartItems.find((x) => x.cartItemId === cartItemId);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.cartItemId === cartItemId
            ? {
                ...existItem,
                qty: safeQty,
                selectedQuantity: safeQty,
                selectedStock: countInStock,
                selectedPrice: price,
                countInStock,
              }
            : x
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          cartItemId,
          product: productId,
          name: product.name,
          image: product.image,
          price,
          selectedVariant: {
            _id: variantId,
            name: variant.name,
            sku: variant.sku || "",
          },
          selectedPrice: price,
          selectedStock: countInStock,
          selectedQuantity: safeQty,
          countInStock,
          qty: safeQty,
        },
      ]);
    }

    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const updateQuantity = (cartItemId, newQty) => {
    const item = cartItems.find((x) => x.cartItemId === cartItemId || x.product === cartItemId);
    if (!item) return;

    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const maxStock = item.countInStock || 999;
    const safeQty = Math.min(newQty, maxStock);

    setCartItems(
      cartItems.map((x) =>
        x.cartItemId === cartItemId || x.product === cartItemId
          ? { ...x, qty: safeQty, selectedQuantity: safeQty }
          : x
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x.cartItemId !== id && x.product !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        totalItemsCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
