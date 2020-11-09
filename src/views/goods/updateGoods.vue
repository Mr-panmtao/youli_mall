<template>
    <div>
        <goods-Info :goodsInfo="goodsInfo" :category_list="category_list" :code="code"></goods-Info>
    </div>
</template>
<script>
import goodsInfo from './components/addGoods.vue'
export default {
  data () {
    return {
      goodsInfo: {},
      category_list: [],
      code: true // 标注为编辑商品
    }
  },
  created () {
    const goodsInfo = this.$route.params
    this.goodsInfo = goodsInfo.goodsInfo
    this.category_list = goodsInfo.category_list
  },
  components: { 'goods-Info': goodsInfo }

}
</script>
