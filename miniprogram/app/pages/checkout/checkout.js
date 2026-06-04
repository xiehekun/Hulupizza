const { getCart, saveCart, getCartTotal } = require("../../utils/cart");

Page({
  data: {
    cart: [],
    cartTotal: 0,
    diningType: "dine-in",
    tableNo: "",
    pickupTime: "",
    remark: "",
    availableCoupons: [],
    selectedCouponId: "",
    discountAmount: 0,
    payableAmount: 0
  },

  onLoad() {
    const app = getApp();
    this.setData({
      diningType: app.globalData.store.diningType,
      tableNo: app.globalData.store.tableNo,
      pickupTime: "尽快取餐"
    });
  },

  onShow() {
    this.refreshOrder();
  },

  refreshOrder() {
    const cart = getCart().map((item) => ({
      ...item,
      optionText: item.selectedOptions.map((option) => option.name).join(" / ") || "标准",
      lineTotal: item.price * item.quantity
    }));
    const cartTotal = getCartTotal(cart);
    const userCoupons = wx.getStorageSync("userCoupons") || [];
    const availableCoupons = userCoupons.filter((coupon) => (
      coupon.status === "unused" && cartTotal >= coupon.threshold
    ));
    const selectedCoupon = availableCoupons.find((coupon) => coupon.id === this.data.selectedCouponId);
    const discountAmount = selectedCoupon ? selectedCoupon.amount : 0;

    this.setData({
      cart,
      cartTotal,
      availableCoupons,
      discountAmount,
      payableAmount: Math.max(cartTotal - discountAmount, 0)
    });
  },

  selectDiningType(event) {
    this.setData({ diningType: event.currentTarget.dataset.type });
  },

  onTableInput(event) {
    this.setData({ tableNo: event.detail.value });
  },

  onPickupInput(event) {
    this.setData({ pickupTime: event.detail.value });
  },

  onRemarkInput(event) {
    this.setData({ remark: event.detail.value });
  },

  selectCoupon(event) {
    const id = event.currentTarget.dataset.id;
    const selectedCouponId = this.data.selectedCouponId === id ? "" : id;
    this.setData({ selectedCouponId }, () => this.refreshOrder());
  },

  submitOrder() {
    if (this.data.cart.length === 0) {
      wx.showToast({ title: "购物车为空", icon: "none" });
      return;
    }

    if (this.data.diningType === "dine-in" && !this.data.tableNo) {
      wx.showToast({ title: "请填写桌号", icon: "none" });
      return;
    }

    const orderId = `P${Date.now()}`;
    const selectedCoupon = this.data.availableCoupons.find((coupon) => coupon.id === this.data.selectedCouponId);
    const order = {
      id: orderId,
      status: "制作中",
      diningType: this.data.diningType,
      tableNo: this.data.tableNo,
      pickupTime: this.data.pickupTime,
      pickupCode: orderId.slice(-4),
      remark: this.data.remark,
      items: this.data.cart,
      totalAmount: this.data.cartTotal,
      discountAmount: this.data.discountAmount,
      payableAmount: this.data.payableAmount,
      couponId: selectedCoupon ? selectedCoupon.id : "",
      createdAt: new Date().toLocaleString()
    };

    const orders = wx.getStorageSync("orders") || [];
    orders.unshift(order);
    wx.setStorageSync("orders", orders);

    if (selectedCoupon) {
      const userCoupons = wx.getStorageSync("userCoupons") || [];
      wx.setStorageSync("userCoupons", userCoupons.map((coupon) => (
        coupon.id === selectedCoupon.id ? { ...coupon, status: "used", orderId } : coupon
      )));
    }

    saveCart([]);
    wx.redirectTo({ url: `/pages/order-detail/order-detail?id=${orderId}` });
  }
});
