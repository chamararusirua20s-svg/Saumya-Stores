export const getProductVariants = (product = {}) => {
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants.map((variant, index) => ({
      _id: variant._id || `${product._id || "product"}-${index}`,
      name: variant.name || `Variant ${index + 1}`,
      sellingPrice: Number(variant.sellingPrice) || 0,
      buyingPrice: Number(variant.buyingPrice) || 0,
      stock: Number(variant.stock) || 0,
      sku: variant.sku || "",
    }));
  }

  return [
    {
      _id: `${product._id || "product"}-default`,
      name: "Default",
      sellingPrice: Number(product.sellingPrice ?? product.price) || 0,
      buyingPrice: Number(product.buyingPrice ?? product.price) || 0,
      stock: Number(product.quantity ?? product.countInStock) || 0,
      sku: product.barcode || "",
    },
  ];
};

export const getVariantFinalPrice = (variant, discount = 0) => {
  const sellingPrice = Number(variant?.sellingPrice) || 0;
  return sellingPrice * (1 - (Number(discount) || 0) / 100);
};

export const getTotalVariantStock = (product = {}) =>
  getProductVariants(product).reduce((total, variant) => total + variant.stock, 0);

export const getPriceRange = (product = {}) => {
  const variants = getProductVariants(product);
  const prices = variants.map((variant) => getVariantFinalPrice(variant, product.discount));
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return { min, max, same: min === max };
};

export const getCartItemId = (productId, variantId) =>
  `${productId}:${variantId || "default"}`;
