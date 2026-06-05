const { getCart, saveCart, getCartTotal } = require("../../utils/cart");
const { getProducts } = require("../../utils/product-store");

Page({
  data: {
    cart: [],
    cartTotal: 0
  },

  onShow() {
    this.refreshCart();
  },

  refreshCart() {
    const products = getProducts();
    const cart = getCart().map((item) => ({
      ...item,
      optionText: item.selectedOptions.map((option) => option.name).join(" / ") || "标准",
      stock: this.getProductStock(products, item.productId)
    }));

    this.setData({
      cart,
      cartTotal: getCartTotal(cart)
    });
  },

  getProductStock(products, productId) {
    const product = products.find((item) => item.id === productId);
    if (!product || !product.listed || product.soldOut) return 0;
    return product.stock;
  },

  changeQuantity(event) {
    const { key, delta } = event.currentTarget.dataset;
    const products = getProducts();
    const currentCart = getCart();
    const targetItem = currentCart.find((item) => item.key === key);
    if (!targetItem) return;

    const stock = this.getProductStock(products, targetItem.productId);
    const nextQuantity = targetItem.quantity + Number(delta);
    const productQuantity = currentCart
      .filter((item) => item.productId === targetItem.productId)
      .reduce((sum, item) => sum + item.quantity, 0);
    const nextProductQuantity = productQuantity + Number(delta);

    if (nextQuantity > 0 && nextProductQuantity > stock) {
      wx.showToast({ title: "库存不足", icon: "none" });
      return;
    }

    const cart = currentCart
      .map((item) => (
        item.key === key ? { ...item, quantity: nextQuantity } : item
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
