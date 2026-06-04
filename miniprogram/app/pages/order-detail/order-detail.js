Page({
  data: {
    orderId: "",
    order: null
  },

  onLoad(query) {
    this.setData({ orderId: query.id });
    this.refreshOrder();
  },

  refreshOrder() {
    const orders = wx.getStorageSync("orders") || [];
    const rawOrder = orders.find((item) => item.id === this.data.orderId);

    if (!rawOrder) {
      wx.showToast({ title: "订单不存在", icon: "none" });
      return;
    }

    const order = {
      ...rawOrder,
      diningTypeText: rawOrder.diningType === "dine-in" ? `堂食 ${rawOrder.tableNo}` : `自取 ${rawOrder.pickupTime}`,
      items: rawOrder.items.map((item) => ({
        ...item,
        optionText: item.selectedOptions.map((option) => option.name).join(" / ") || "标准",
        lineTotal: item.price * item.quantity
      }))
    };

    this.setData({ order });
  },

  completeOrder() {
    const orders = wx.getStorageSync("orders") || [];
    const nextOrders = orders.map((order) => (
      order.id === this.data.orderId ? { ...order, status: "已完成" } : order
    ));

    wx.setStorageSync("orders", nextOrders);
    this.refreshOrder();
    wx.showToast({ title: "订单已完成", icon: "success" });
  }
});
