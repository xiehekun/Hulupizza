const { products: seedProducts } = require("./mock-data");

const STORAGE_KEY = "products";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeProduct(product) {
  return {
    id: product.id || `product-${Date.now()}`,
    categoryId: product.categoryId || "pizza",
    name: product.name || "未命名商品",
    description: product.description || "",
    price: Number(product.price) || 0,
    image: product.image || "",
    tags: Array.isArray(product.tags) ? product.tags : [],
    soldOut: Boolean(product.soldOut),
    listed: product.listed !== false,
    options: Array.isArray(product.options) ? product.options : []
  };
}

function seedProductsIfNeeded() {
  const existing = wx.getStorageSync(STORAGE_KEY);
  if (!existing) {
    wx.setStorageSync(STORAGE_KEY, clone(seedProducts.map((item) => normalizeProduct(item))));
  }
}

function getProducts() {
  seedProductsIfNeeded();
  return (wx.getStorageSync(STORAGE_KEY) || []).map((item) => normalizeProduct(item));
}

function saveProducts(products) {
  wx.setStorageSync(STORAGE_KEY, products.map((item) => normalizeProduct(item)));
}

function getVisibleProducts() {
  return getProducts().filter((item) => item.listed && !item.soldOut);
}

function upsertProduct(product) {
  const products = getProducts();
  const normalizedProduct = normalizeProduct(product);
  const index = products.findIndex((item) => item.id === normalizedProduct.id);

  if (index >= 0) {
    products[index] = normalizedProduct;
  } else {
    products.unshift(normalizedProduct);
  }

  saveProducts(products);
  return normalizedProduct;
}

function toggleListed(productId) {
  const products = getProducts().map((item) => (
    item.id === productId ? { ...item, listed: !item.listed } : item
  ));
  saveProducts(products);
}

function toggleSoldOut(productId) {
  const products = getProducts().map((item) => (
    item.id === productId ? { ...item, soldOut: !item.soldOut } : item
  ));
  saveProducts(products);
}

function deleteProduct(productId) {
  saveProducts(getProducts().filter((item) => item.id !== productId));
}

module.exports = {
  seedProductsIfNeeded,
  getProducts,
  getVisibleProducts,
  upsertProduct,
  toggleListed,
  toggleSoldOut,
  deleteProduct
};
