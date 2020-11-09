export default {
  goods_category: [
    { required: true, message: '请选择商品所属分类', trigger: 'change' }
  ],
  goods_name: [
    { required: true, message: '请填写商品名称', trigger: 'blur' }
  ],
  goods_price: [
    { required: true, message: '请填写商品销售价格', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请填写商品库存量', trigger: 'blur' }
  ],
  goods_img: [
    { required: true, message: '请上传商品主图图片', trigger: 'blur' }
  ],
  goodsSwiper: [
    { required: true, message: '请上传商品轮播图图片', trigger: 'blur' }
  ]
}
