const { categories } = require("../../utils/mock-data");
const { getVisibleProducts } = require("../../utils/product-store");
const { getCart, saveCart, getCartTotal, getCartCount, buildCartKey } = require("../../utils/cart");

Page({
  data: {
    categories,
    products: [],
    activeCategory: "pizza",
    visibleProducts: [],
    cartCount: 0,
    cartTotal: 0,
    selectedProduct: null,
    selectedOptions: [],
    selectedPrice: 0
  },

  onShow() {
    this.refreshStoreProducts();
    this.refreshCart();
  },

  refreshStoreProducts() {
    const displayProducts = getVisibleProducts().map((item) => ({
      ...item,
      initial: item.name.substring(0, 1)
    }));

    this.setData({ products: displayProducts }, () => this.refreshProducts());
  },

  selectCategory(event) {
    this.setData({ activeCategory: event.currentTarget.dataset.id }, () => this.refreshProducts());
  },

  refreshProducts() {
    this.setData({
      visibleProducts: this.data.products.filter((item) => item.categoryId === this.data.activeCategory)
    });
  },

  refreshCart() {
    const cart = getCart();
    this.setData({
      cartCount: getCartCount(cart),
      cartTotal: getCartTotal(cart)
    });
  },

  openProduct(event) {
    const product = this.data.products.find((item) => item.id === event.currentTarget.dataset.id);
    const selectedOptions = product.options.map((group) => ({
      group: group.group,
      name: group.values[0].name,
      price: group.values[0].price
    }));

    this.setData({
      selectedProduct: this.buildProductView(product, selectedOptions),
      selectedOptions,
      selectedPrice: this.calculateSelectedPrice(product, selectedOptions)
    });
  },

  closeProduct() {
    this.setData({ selectedProduct: null, selectedOptions: [], selectedPrice: 0 });
  },

  selectOption(event) {
    const { group, name, price } = event.currentTarget.dataset;
    const selectedOptions = this.data.selectedOptions.map((item) => (
      item.group === group ? { group, name, price: Number(price) } : item
    ));

    this.setData({
      selectedOptions,
      selectedProduct: this.buildProductView(this.data.selectedProduct, selectedOptions),
      selectedPrice: this.calculateSelectedPrice(this.data.selectedProduct, selectedOptions)
    });
  },

  buildProductView(product, selectedOptions) {
    return {
      ...product,
      options: product.options.map((group) => ({
        ...group,
        values: group.values.map((option) => ({
          ...option,
          selected: selectedOptions.some((item) => item.group === group.group && item.name === option.name)
        }))
      }))
    };
  },

  calculateSelectedPrice(product, selectedOptions) {
    return product.price + selectedOptions.reduce((sum, item) => sum + Number(item.price), 0);
  },

  addToCart() {
    const product = this.data.selectedProduct;
    const selectedOptions = this.data.selectedOptions;
    const key = buildCartKey(product.id, selectedOptions);
    const cart = getCart();
    const productQuantity = cart
      .filter((item) => item.productId === product.id)
      .reduce((sum, item) => sum + item.quantity, 0);

    if (productQuantity >= product.stock) {
      wx.showToast({ title: "库存不足", icon: "none" });
      return;
    }

    const existing = cart.find((item) => item.key === key);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        key,
        productId: product.id,
        name: product.name,
        price: this.data.selectedPrice,
        quantity: 1,
        selectedOptions
      });
    }

    saveCart(cart);
    this.closeProduct();
    this.refreshCart();
    wx.showToast({ title: "已加入购物车", icon: "success" });
  },

  goCart() {
    wx.navigateTo({ url: "/pages/cart/cart" });
  }
});
