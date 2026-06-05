const { getVisibleProducts } = require("../../utils/product-store");

Page({
  data: {
    store: {},
    recommends: [],
    tableNo: ""
  },

  onLoad(query) {
    const app = getApp();
    if (query.table) {
      app.globalData.store.tableNo = query.table;
      app.globalData.store.diningType = "dine-in";
    }
    this.setData({
      store: app.globalData.store,
      tableNo: app.globalData.store.tableNo || ""
    });
  },

  onShow() {
    this.setData({
      recommends: getVisibleProducts().filter((item) => item.tags.length).slice(0, 3)
    });
  },

  onTableInput(event) {
    this.setData({ tableNo: event.detail.value });
  },

  startDineIn() {
    const app = getApp();
    app.globalData.store.tableNo = this.data.tableNo.trim() || "A01";
    app.globalData.store.diningType = "dine-in";
    wx.switchTab({ url: "/pages/menu/menu" });
  },

  startPickup() {
    const app = getApp();
    app.globalData.store.tableNo = "";
    app.globalData.store.diningType = "pickup";
    wx.switchTab({ url: "/pages/menu/menu" });
  },

  goMenu() {
    wx.switchTab({ url: "/pages/menu/menu" });
  },

  goCoupons() {
    wx.navigateTo({ url: "/pages/coupons/coupons" });
  }
});
