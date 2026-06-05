const { products: seedProducts } = require("./mock-data");

const STORAGE_KEY = "products";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeProduct(product) {
  const seedProduct = seedProducts.find((item) => item.id === product.id);
  const fallbackStock = seedProduct ? seedProduct.stock : 0;

  return {
    id: product.id || `product-${Date.now()}`,
    categoryId: product.categoryId || "pizza",
    name: product.name || "未命名商品",
    description: product.description || "",
    price: Number(product.price) || 0,
    stock: Number(product.stock) >= 0 ? Number(product.stock) : fallbackStock,
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
  return getProducts().filter((item) => item.listed && !item.soldOut && item.stock > 0);
}

function getRequestedQuantities(cart) {
  return cart.reduce((quantities, item) => {
    quantities[item.productId] = (quantities[item.productId] || 0) + item.quantity;
    return quantities;
  }, {});
}

function checkStock(cart) {
  const products = getProducts();
  const quantities = getRequestedQuantities(cart);
  const shortages = Object.keys(quantities)
    .map((productId) => {
      const product = products.find((item) => item.id === productId);
      const requested = quantities[productId];

      if (!product) {
        return { productId, name: "已下架商品", requested, available: 0 };
      }

      if (!product.listed || product.soldOut || product.stock < requested) {
        return {
          productId,
          name: product.name,
          requested,
          available: product.listed && !product.soldOut ? product.stock : 0
        };
      }

      return null;
    })
    .filter(Boolean);

  return {
    ok: shortages.length === 0,
    shortages
  };
}

function deductStock(cart) {
  const stockCheck = checkStock(cart);
  if (!stockCheck.ok) return stockCheck;

  const quantities = getRequestedQuantities(cart);
  const products = getProducts().map((item) => (
    quantities[item.id] ? { ...item, stock: item.stock - quantities[item.id] } : item
  ));

  saveProducts(products);
  return { ok: true, shortages: [] };
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
  checkStock,
  deductStock,
  toggleListed,
  toggleSoldOut,
  deleteProduct
};
