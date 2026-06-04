function getCart() {
  return wx.getStorageSync("cart") || [];
}

function saveCart(cart) {
  wx.setStorageSync("cart", cart);
}

function getCartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function buildCartKey(productId, selectedOptions) {
  const optionText = selectedOptions.map((item) => `${item.group}:${item.name}`).join("|");
  return `${productId}-${optionText}`;
}

module.exports = {
  getCart,
  saveCart,
  getCartTotal,
  getCartCount,
  buildCartKey
};
