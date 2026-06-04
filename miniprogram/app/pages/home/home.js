const { products } = require("../../utils/mock-data");

Page({
  data: {
    store: {},
    recommends: []
  },

  onLoad(query) {
    const app = getApp();
    if (query.table) {
      app.globalData.store.tableNo = query.table;
      app.globalData.store.diningType = "dine-in";
    }

    this.setData({
      store: app.globalData.store,
      recommends: products.filter((item) => item.tags.length).slice(0, 3)
    });
  },

  startDineIn() {
    wx.showModal({
      title: "输入桌号",
      editable: true,
      placeholderText: "例如 A01",
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          app.globalData.store.tableNo = res.content || "A01";
          app.globalData.store.diningType = "dine-in";
          wx.switchTab({ url: "/pages/menu/menu" });
        }
      }
    });
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
