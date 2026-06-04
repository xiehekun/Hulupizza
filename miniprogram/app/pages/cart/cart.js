const { getCart, saveCart, getCartTotal } = require("../../utils/cart");

Page({
  data: {
    cart: [],
    cartTotal: 0
  },

  onShow() {
    this.refreshCart();
  },

  refreshCart() {
    const cart = getCart().map((item) => ({
      ...item,
      optionText: item.selectedOptions.map((option) => option.name).join(" / ") || "标准"
    }));

    this.setData({
      cart,
      cartTotal: getCartTotal(cart)
    });
  },

  changeQuantity(event) {
    const { key, delta } = event.currentTarget.dataset;
    const cart = getCart()
      .map((item) => (
        item.key === key ? { ...item, quantity: item.quantity + Number(delta) } : item
      ))
      .filter((item) => item.quantity > 0);

    saveCart(cart);
    this.refreshCart();
  },

  removeItem(event) {
    const key = event.currentTarget.dataset.key;
    const cart = getCart().filter((item) => item.key !== key);
    saveCart(cart);
    this.refreshCart();
  },

  goMenu() {
    wx.switchTab({ url: "/pages/menu/menu" });
  },

  goCheckout() {
    wx.navigateTo({ url: "/pages/checkout/checkout" });
  }
});
