<template>
  <div class="box">
    <goods-Info :category_list="category_list"></goods-Info>
  </div>
</template>
<script>
import goodsInfo from './components/addGoods.vue'

export default {
  data () {
    return {
      category_list: []
    }
  },
  components: { 'goods-Info': goodsInfo },
  created () {
    this.getCategory()
  },
  methods: {
    // 获取分类数据
    async getCategory () {
      const { data: res } = await this.$axios.get('getCategory')
      this.category_list = this.getTreeData(res.data)
    },
    // 递归方法
    getTreeData (data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children)
        }
      }
      return data
    }
  }
}
</script>
<style scoped>
.box {
  width: 100%;
  height: 100%;
}
</style>
