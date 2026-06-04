App({
  globalData: {
    store: {
      name: "窑火披萨",
      status: "营业中",
      phone: "021-0000-0000",
      tableNo: "",
      diningType: "dine-in"
    }
  },

  onLaunch() {
    const { seedProductsIfNeeded } = require("./utils/product-store");
    const cart = wx.getStorageSync("cart");
    const orders = wx.getStorageSync("orders");
    const userCoupons = wx.getStorageSync("userCoupons");

    seedProductsIfNeeded();
    if (!cart) wx.setStorageSync("cart", []);
    if (!orders) wx.setStorageSync("orders", []);
    if (!userCoupons) wx.setStorageSync("userCoupons", []);
  }
});
