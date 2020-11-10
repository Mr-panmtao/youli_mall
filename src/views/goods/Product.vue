<template>
  <div class="container">
    <div class="header">
      <!-- <el-button
        @click="dialogGoods = true"
        type="primary"
        size="small"
        icon="el-icon-circle-plus-outline"
        >添加商品</el-button
      > -->
      <el-cascader
        v-model="cat_value"
        class="mar"
        :options="category_list"
        :props="options"
        @change="handleChange"
        size="small"
        clearable
        placeholder="所有分类"
      ></el-cascader>
      <el-select
        size="small"
        style="width:150px"
        v-model="sel_value"
        placeholder="所有状态"
        clearable
      >
        <el-option label="出售中" value="1"> </el-option>
        <el-option label="已下架" value="0"> </el-option>
      </el-select>
      <el-input
        class="mar"
        size="small"
        placeholder="商品关键字"
        v-model="goods_val"
        clearable
        style="width:150px"
      >
      </el-input>
      <el-button
        @click="getGoods"
        size="small"
        type="primary"
        icon="el-icon-search"
        >搜索</el-button
      >
    </div>

    <div class="body">
      <el-table
        ref="multipleTable"
        :data="goodsInfo"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>
        <el-table-column align="center" prop="id" label="编号" width="50">
        </el-table-column>
        <el-table-column
          align="center"
          prop="goods_img"
          label="商品图片"
          width="140"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.goods_img"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          show-overflow-tooltip
          width="470"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="goods_price"
          sortable
          label="价格"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="goods_number"
          sortable
          label="销量"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="goods_views"
          sortable
          label="浏览量"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="stock"
          sortable
          label="库存"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="标签"
        >
          <template slot-scope="scope">
            <div class="item">
              热门
              <el-switch
                v-model="scope.row.is_hot"
                active-value="1"
                inactive-value="0"
                 @change="shelfChange(scope.row)"
              >
                >
              </el-switch>
            </div>
            <div class="item">
              上架
              <el-switch
                v-model="scope.row.is_shelf"
                active-value="1"
                inactive-value="0"
                @change="shelfChange(scope.row)"
              >
                >
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editGoods(scope.row)"
              >编辑</el-button
            >

            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delGoods(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        background
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

  </div>
</template>
<script>
export default {
  data () {
    return {
      // 商品数据
      goodsInfo: [],

      // 分类数据
      category_list: [],
      options: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'id'
      },
      // 所选分类
      cat_value: '',
      // 所选状态
      sel_value: '',
      // 商品关键字
      goods_val: '',
      // 当前页
      pageNum: 1,
      // 页大小
      pageSize: 5,
      // 总数据
      total: 0,

      // 添加商品 dialog
      dialogGoods: false,
      // 商品信息对象
      goods_list: {}
    }
  },
  created () {
    this.getGoods()
    this.getCategory()
  },
  methods: {
    // 获取商品信息
    async getGoods () {
      const { data: res } = await this.$axios.post('getGoods', {
        cat_value: this.cat_value,
        sel_value: this.sel_value,
        goods_val: this.goods_val,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
      this.total = res.total
      this.goodsInfo = res.data
    },
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
          delete data[i].children
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children)
        }
      }
      return data
    },

    // 分类条件筛选
    handleChange (item) {
      if (item.length >= 1) {
        this.cat_value = item.join(',')
      } else {
        this.cat_value = ''
      }
    },

    // 添加商品dialog
    closeDialog (bool) {
      this.dialogGoods = bool
    },

    // 编辑商品状态
    async shelfChange (code) {
      const goodsInfo = JSON.parse(JSON.stringify(code))
      const id = code.id
      delete goodsInfo.goodsSwiper
      delete goodsInfo.goods_SKU
      delete goodsInfo.id

      const { data: res } = await this.$axios.post(`modifyGoods?id=${id}`, goodsInfo)
      const type = res.status === 201 ? 'success' : 'error'
      this.$message({ message: res.msg, type })
      this.getGoods()
    },

    // 删除商品
    delGoods (item) {
      this.$confirm(`你确定要删除 【${item.goods_name} 】 该商品吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const goodsType = item.specifications.length
        // const info = { id: item.id, type: goodsType }
        // console.log(info)
        const { data: res } = await this.$axios.get(
          `delGoods?id=${item.id}&&type=${goodsType}`
        )
        const type = res.status === 201 ? 'success' : 'error'
        this.$message({ message: res.msg, type })
        this.getGoods()
      })
    },

    // 页大小发生改变
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getGoods()
    },
    // 当前页发生改变
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum
      this.getGoods()
    },

    // 编辑商品
    editGoods (item) {
      this.$router.push({ name: 'updateGoods', params: { goodsInfo: item, category_list: this.category_list } })
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  .mar {
    margin: 0 10px;
  }
}
.body {
  .item {
    margin: 7px;
    display: flex;
    justify-content: space-evenly;
  }
}
</style>
