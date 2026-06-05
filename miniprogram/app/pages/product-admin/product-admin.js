const { categories } = require("../../utils/mock-data");
const {
  getProducts,
  upsertProduct,
  toggleListed,
  toggleSoldOut,
  deleteProduct
} = require("../../utils/product-store");

const emptyForm = {
  id: "",
  categoryId: "pizza",
  name: "",
  description: "",
  price: "",
  stock: "",
  tagText: "",
  listed: true,
  soldOut: false,
  image: "",
  options: []
};

Page({
  data: {
    products: [],
    categories,
    categoryNames: categories.map((item) => item.name),
    categoryIndex: 0,
    currentCategoryName: categories[0].name,
    showForm: false,
    editingId: "",
    form: { ...emptyForm }
  },

  onShow() {
    this.refreshProducts();
  },

  refreshProducts() {
    const products = getProducts().map((item) => {
      const category = categories.find((categoryItem) => categoryItem.id === item.categoryId);
      return {
        ...item,
        categoryName: category ? category.name : "未分类",
        tagText: item.tags.join("，"),
        statusText: item.stock <= 0 ? "无库存" : item.soldOut ? "售罄" : item.listed ? "上架" : "下架"
      };
    });

    this.setData({ products });
  },

  startCreate() {
    this.setData({
      showForm: true,
      editingId: "",
      categoryIndex: 0,
      currentCategoryName: categories[0].name,
      form: { ...emptyForm }
    });
  },

  editProduct(event) {
    const product = getProducts().find((item) => item.id === event.currentTarget.dataset.id);
    const categoryIndex = Math.max(categories.findIndex((item) => item.id === product.categoryId), 0);

    this.setData({
      showForm: true,
      editingId: product.id,
      categoryIndex,
      currentCategoryName: categories[categoryIndex].name,
      form: {
        ...product,
        tagText: product.tags.join("，"),
        price: String(product.price),
        stock: String(product.stock)
      }
    });
  },

  cancelForm() {
    this.setData({
      showForm: false,
      editingId: "",
      form: { ...emptyForm }
    });
  },

  onInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({
      form: {
        ...this.data.form,
        [field]: event.detail.value
      }
    });
  },

  onSwitch(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({
      form: {
        ...this.data.form,
        [field]: event.detail.value
      }
    });
  },

  onCategoryChange(event) {
    const categoryIndex = Number(event.detail.value);
    this.setData({
      categoryIndex,
      currentCategoryName: categories[categoryIndex].name,
      form: {
        ...this.data.form,
        categoryId: categories[categoryIndex].id
      }
    });
  },

  saveProduct() {
    const form = this.data.form;
    const name = form.name.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!name) {
      wx.showToast({ title: "请填写商品名称", icon: "none" });
      return;
    }

    if (!price || price < 0) {
      wx.showToast({ title: "请填写有效价格", icon: "none" });
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      wx.showToast({ title: "请填写有效库存", icon: "none" });
      return;
    }

    upsertProduct({
      ...form,
      id: this.data.editingId || `product-${Date.now()}`,
      name,
      price,
      stock,
      tags: form.tagText
        .split(/[,，]/)
        .map((item) => item.trim())
        .filter(Boolean)
    });

    this.cancelForm();
    this.refreshProducts();
    wx.showToast({ title: "已保存", icon: "success" });
  },

  toggleListed(event) {
    toggleListed(event.currentTarget.dataset.id);
    this.refreshProducts();
  },

  toggleSoldOut(event) {
    toggleSoldOut(event.currentTarget.dataset.id);
    this.refreshProducts();
  },

  deleteProduct(event) {
    const productId = event.currentTarget.dataset.id;
    wx.showModal({
      title: "删除商品",
      content: "删除后不会再出现在商品管理和点餐页。",
      success: (res) => {
        if (res.confirm) {
          deleteProduct(productId);
          this.refreshProducts();
          wx.showToast({ title: "已删除", icon: "success" });
        }
      }
    });
  }
});
