const categories = [
  { id: "pizza", name: "窑烤披萨" },
  { id: "snack", name: "小食" },
  { id: "drink", name: "饮品" },
  { id: "combo", name: "套餐" }
];

const products = [
  {
    id: "p1",
    categoryId: "pizza",
    name: "玛格丽特披萨",
    description: "番茄酱、马苏里拉、罗勒，最经典的窑烤香气。",
    price: 58,
    image: "",
    tags: ["招牌"],
    soldOut: false,
    options: [
      { group: "尺寸", values: [{ name: "10寸", price: 0 }, { name: "12寸", price: 18 }] },
      { group: "加料", values: [{ name: "不加料", price: 0 }, { name: "双倍芝士", price: 12 }, { name: "意式辣肠", price: 16 }] }
    ]
  },
  {
    id: "p2",
    categoryId: "pizza",
    name: "意式辣香肠披萨",
    description: "辣香肠、番茄酱、马苏里拉，适合重口味。",
    price: 68,
    image: "",
    tags: ["热卖"],
    soldOut: false,
    options: [
      { group: "尺寸", values: [{ name: "10寸", price: 0 }, { name: "12寸", price: 20 }] },
      { group: "辣度", values: [{ name: "正常", price: 0 }, { name: "加辣", price: 0 }] }
    ]
  },
  {
    id: "p3",
    categoryId: "pizza",
    name: "蘑菇火腿披萨",
    description: "蘑菇、火腿、洋葱和奶酪，风味柔和。",
    price: 66,
    image: "",
    tags: [],
    soldOut: false,
    options: [
      { group: "尺寸", values: [{ name: "10寸", price: 0 }, { name: "12寸", price: 18 }] }
    ]
  },
  {
    id: "s1",
    categoryId: "snack",
    name: "蒜香面包",
    description: "适合搭配披萨分享。",
    price: 18,
    image: "",
    tags: [],
    soldOut: false,
    options: []
  },
  {
    id: "s2",
    categoryId: "snack",
    name: "烤鸡翅",
    description: "一份 6 只，炉烤焦香。",
    price: 36,
    image: "",
    tags: ["推荐"],
    soldOut: false,
    options: [
      { group: "口味", values: [{ name: "原味", price: 0 }, { name: "黑椒", price: 0 }, { name: "辣味", price: 0 }] }
    ]
  },
  {
    id: "d1",
    categoryId: "drink",
    name: "柠檬气泡水",
    description: "清爽解腻。",
    price: 16,
    image: "",
    tags: [],
    soldOut: false,
    options: []
  },
  {
    id: "c1",
    categoryId: "combo",
    name: "双人分享套餐",
    description: "玛格丽特披萨、蒜香面包、两杯气泡水。",
    price: 98,
    image: "",
    tags: ["套餐价"],
    soldOut: false,
    options: []
  }
];

const coupons = [
  {
    id: "coupon-new",
    name: "新客立减券",
    description: "首单满 59 元减 10 元",
    threshold: 59,
    amount: 10,
    type: "new-user"
  },
  {
    id: "coupon-full",
    name: "分享满减券",
    description: "满 99 元减 15 元",
    threshold: 99,
    amount: 15,
    type: "full-reduction"
  }
];

module.exports = {
  categories,
  products,
  coupons
};
