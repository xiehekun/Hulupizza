const { coupons } = require("../../utils/mock-data");

Page({
  data: {
    coupons: []
  },

  onShow() {
    this.refreshCoupons();
  },

  refreshCoupons() {
    const userCoupons = wx.getStorageSync("userCoupons") || [];
    this.setData({
      coupons: coupons.map((coupon) => ({
        ...coupon,
        received: userCoupons.some((item) => item.id === coupon.id && item.status === "unused")
      }))
    });
  },

  receiveCoupon(event) {
    const id = event.currentTarget.dataset.id;
    const coupon = coupons.find((item) => item.id === id);
    const userCoupons = wx.getStorageSync("userCoupons") || [];
    const hasCoupon = userCoupons.some((item) => item.id === id && item.status === "unused");

    if (hasCoupon) {
      wx.showToast({ title: "已领取", icon: "none" });
      return;
    }

    userCoupons.push({ ...coupon, status: "unused", receivedAt: Date.now() });
    wx.setStorageSync("userCoupons", userCoupons);
    this.refreshCoupons();
    wx.showToast({ title: "领取成功", icon: "success" });
  }
});
