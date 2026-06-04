Page({
  data: {
    orders: []
  },

  onShow() {
    const orders = (wx.getStorageSync("orders") || []).map((order) => ({
      ...order,
      diningTypeText: order.diningType === "dine-in" ? `堂食 ${order.tableNo}` : `自取 ${order.pickupTime}`,
      itemSummary: order.items.map((item) => `${item.name}x${item.quantity}`).join("、")
    }));

    this.setData({ orders });
  },

  goMenu() {
    wx.switchTab({ url: "/pages/menu/menu" });
  },

  goDetail(event) {
    wx.navigateTo({ url: `/pages/order-detail/order-detail?id=${event.currentTarget.dataset.id}` });
  }
});
