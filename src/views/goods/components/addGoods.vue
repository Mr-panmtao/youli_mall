<template>
  <div class="addProduct-box">
    <div class="goods_header">
      <el-steps :active="active" align-center finish-status="success">
        <el-step title="商品信息" description="请填写商品的基本信息"></el-step>
        <el-step title="商品图片" description="上传商品图片"></el-step>
        <el-step title="商品规格" description="填写商品规格 (选填)"></el-step>
        <el-step title="商品详情" description="图文详情 (选填)"></el-step>
      </el-steps>
    </div>
    <div class="goods_body">
      <el-form
        :model="goodsForm"
        :rules="goodsrules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="left"
      >
        <el-tabs
          tabPosition="left"
          @tab-click="tabClick"
          style="height: 200px;"
        >
          <el-tab-pane label="商品信息">
            <div class="goods_list_info">
              <el-form-item label="商品分类" prop="goods_category">
                <el-cascader
                  style="width:100%"
                  v-model="goodsForm.goods_category"
                  :options="category_list"
                  :props="options"
                  clearable
                  placeholder="请选择商品分类"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="商品名称" prop="goods_name">
                <el-input
                  placeholder="请填写商品名称"
                  v-model="goodsForm.goods_name"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品卖点">
                <el-input
                  placeholder="商品卖点或简要介绍"
                  v-model="goodsForm.selling_point"
                ></el-input>
              </el-form-item>
              <el-form-item label="销售价" prop="goods_price">
                <el-input
                  placeholder="请填写商品销售价格"
                  v-model="goodsForm.goods_price"
                ></el-input>
              </el-form-item>
              <el-form-item label="划线价">
                <el-input
                  placeholder="请填写商品划线价格"
                  v-model="goodsForm.goods_scribing"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品库存" prop="stock">
                <el-input
                  placeholder="请填写商品库存"
                  v-model="goodsForm.stock"
                ></el-input>
              </el-form-item>
              <el-form-item label="是否启用" prop="is_shelf">
                <el-switch
                  inactive-value="0"
                  active-value="1"
                  inactive-text="禁用"
                  active-text="启用"
                  v-model="goodsForm.is_shelf"
                ></el-switch>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <div class="spec-title">
              <el-alert title="商品图片 (不可为空)" type="warning"> </el-alert>
            </div>
            <el-form-item label="商品主图" prop="goods_img">
              <div class="upload">
                <el-upload
                  :action="action"
                  list-type="picture-card"
                  :on-preview="previewImg"
                  :on-success="successImg"
                  :on-remove="removeImg"
                  :limit="1"
                  ref="upload"
                  :file-list="goods_img"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
              <el-dialog :visible.sync="dialogImg">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </el-form-item>
            <el-form-item label="商品轮播图" prop="goodsSwiper">
              <div class="upload">
                <el-upload
                  :action="action"
                  list-type="picture-card"
                  :on-preview="previewImg1"
                  :on-success="successImg1"
                  :on-remove="removeImg1"
                  :limit="5"
                  ref="upload"
                  :file-list="goodsSwiper"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
              <el-dialog :visible.sync="dialogImg1">
                <img width="100%" :src="dialogImageUrl1" alt="" />
              </el-dialog>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品规格">
            <div class="spec-title">
              <el-alert title=" 商品规格添加 (选填)" type="warning"> </el-alert>
            </div>
            <div class="addSpec">
              <span class="span">规格名称:</span>
              <div class="addSpec-item">
                <el-tag
                  :key="tag"
                  v-for="(tag, i) in dynamicTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, i)"
                  size="medium"
                >
                  {{ tag }}
                </el-tag>
                <div class="addSpecBtn">
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    style="width:160px"
                    placeholder="规格名称"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  >
                  </el-input>
                  <el-button
                    v-else
                    type="primary"
                    class="button-new-tag"
                    size="small"
                    @click="showInput"
                    >+ 添加新规格</el-button
                  >
                </div>
              </div>
            </div>
            <!-- 规格值 -->
            <div class="addSpecValue" v-for="(item, i) in specList" :key="i">
              <span class="span">{{ item.name }}:</span>
              <el-tag
                size="medium"
                type="info"
                v-for="tag in item.item"
                :key="tag"
                closable
                @close="handleClose1(tag, i, item.name)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                size="small"
                style="width:160px"
                placeholder="设置属性"
                v-model="item.thisVal"
              >
              </el-input>
              <el-button
                @click="addSpecValue(item.thisVal, i)"
                size="small"
                type="primary"
                >添加</el-button
              >
            </div>
            <div class="sepec-data">
              <el-table
                v-show="data1.length >= 1"
                :data="data1"
                border
                style="width: 100%"
              >
                <el-table-column prop="spec_val" label="规格值" width="180">
                </el-table-column>
                <el-table-column
                  prop="foreign_key"
                  label="规格图片"
                  width="180"
                >
                  <template slot-scope="scope">
                    <div class="upload-spec">
                      <el-upload
                        :action="action"
                        list-type="picture-card"
                        :on-success="successSpecImg"
                        :objectBind="scope.row.spec_val"
                        :on-remove="
                          (file, fileList) => {
                            removeSpecImg(file, fileList, scope.row.spec_val);
                          }
                        "
                        :limit="1"
                        :file-list="scope.row.spec_img | folterImg"
                      >
                        <i class="el-icon-plus"></i>
                      </el-upload>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="index" label="销售价">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.spec_price"
                      clearable
                      size="small"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="库存">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.spec_stock"
                      clearable
                      size="small"
                    >
                    </el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品详情">
            <div class="spec-title">
              <el-alert title="图文详情 (选填)" type="warning"> </el-alert>
            </div>
            <!-- 富文本编辑器 -->
            <quill-editor v-model="goodsForm.goods_introduce"></quill-editor>
            <div class="saveProduct">
              <el-button type="primary" @click="addGoods">确 定</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>
<script>
import goodsrules from './tools.js'
export default {
  data () {
    return {
      // 步骤
      active: 0,
      // 商品数据对象
      goodsForm: {
        goods_name: '',
        selling_point: '',
        goods_category: '',
        goods_price: '',
        goods_scribing: '',
        stock: '',
        goods_img: '',
        is_shelf: 1,
        goods_introduce: '',
        // 商品规格外键
        foreign_key: 0,
        // 商品轮播图外键
        swiper_id: 0,

        // 商品规格
        specifications: [],
        // 商品规格值 sku
        goods_SKU: [],

        // 商品轮播图
        goodsSwiper: []
      },
      // 表单验证
      goodsrules: goodsrules,

      // 商品分类
      options: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'id'
      },

      // 图片上传地址
      action: 'http://127.0.0.1:3008/upload',
      //   上传图片相关
      dialogImg: false,
      dialogImageUrl: '',
      // 编辑商品显示的图片
      goods_img: [], // 商品主图 == 编辑图片显示
      goodsSwiper: [], // 商品轮播图 == 编辑图片显示
      dialogImg1: false,
      dialogImageUrl1: '',

      // 规格====
      dynamicTags: [], // 保存规格名称
      inputValue: '', // 规格值
      inputVisible: false,

      // 规格值
      specList: [],
      // 设置规格值
      input2: '',

      // 规格表格数据
      data1: [],

      // 当前为添加/编辑商品
      status: false
    }
  },
  filters: {
    folterImg (e) {
      return [{ url: e }]
    }
  },
  props: ['category_list', 'goodsInfo', 'code'],
  created () {
    this.getGoodsId()
    this.status = this.code
    // 编辑商品 ====》规格
    if (this.goodsInfo) {
      const _this = this.goodsInfo
      this.goodsForm = _this
      const arr = []
      _this.specifications.forEach(item => {
        arr.push(item.name)
      })
      this.dynamicTags = arr
      this.specList = _this.specifications
      this.data1 = _this.goods_SKU

      // 商品主图 ==》显示该商品图片
      this.goods_img = [{ url: _this.goods_img }]

      // 商品轮播图
      const swiperImg = []
      _this.goodsSwiper.forEach(item => {
        swiperImg.push({ url: item })
      })
      this.goodsSwiper = swiperImg
    }
  },
  methods: {
    // 添加商品
    addGoods () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (this.status) {
            return this.$message({
              message: '抱歉！您还没有该权限！',
              type: 'error'
            })
          }
          this.specList.forEach(item => {
            delete item.thisVal
          })
          // 商品分类
          if (Array.isArray(this.goodsForm.goods_category)) {
            this.goodsForm.goods_category = this.goodsForm.goods_category.join(
              ','
            )
          }
          // 商品规格
          this.goodsForm.specifications = this.specList
          // 商品sku
          this.goodsForm.goods_SKU = this.data1
          const { data: res } = await this.$axios.post(
            'addGoods',
            this.goodsForm
          )
          const type = res.status === 201 ? 'success' : 'error'
          this.$message({ message: res.msg, type })
          if (res.status === 201) {
            this.$router.push('product')
          }
        }
      })
    },

    // tab点击
    tabClick (i) {
      this.active = Number(i.index)
    },

    // 查看已经上传的图片
    previewImg (file) {
      this.dialogImg = true
      this.dialogImageUrl = file.url
    },
    // 移除文件列表==>主图
    removeImg () {
      this.goodsForm.goods_img = ''
    },
    // 图片上传成功==>主图
    successImg (response) {
      this.goodsForm.goods_img = response.fileUrl
    },

    // 查看已经上传的图片==>轮播图
    previewImg1 (file) {
      this.dialogImg1 = true
      this.dialogImageUrl1 = file.url
    },
    // 移除文件列表==>轮播图
    removeImg1 (file, fileList) {
      this.goodsForm.goods_img = ''
    },
    // 图片上传成功==>轮播图
    successImg1 (response) {
      this.goodsForm.goodsSwiper.push({
        img_url: response.fileUrl,
        goods_id: this.goodsForm.foreign_key
      })
    },

    // 设置商品外键id
    getGoodsId () {
      // 设置商品外键id swiper_id
      const noTime = Math.round(new Date() / 1000)
      this.goodsForm.foreign_key = noTime
      this.goodsForm.swiper_id = noTime
    },

    // 规格名称移除 ====》
    handleClose (tag, i) {
      this.$confirm(`删除规格 【${tag}】 会连同规格值一起删除`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
        this.specList.splice(i, 1)
        this.specData()
      })
    },
    // 规格值移除 ====》
    handleClose1 (tag, i, name) {
      this.specList[i].item.splice(this.specList[i].item.indexOf(tag), 1)

      if (this.specList[i].item.length === 0) {
        this.specList.splice(i, 1)
        this.dynamicTags.splice(this.dynamicTags.indexOf(name), 1)
      }
      this.specData()
    },

    // 点击添加新规格显示输入框
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 保存新规格
    handleInputConfirm () {
      const inputValue = this.inputValue

      const flag = this.dynamicTags.some(item => {
        return item === inputValue
      })

      if (!flag && inputValue) {
        this.dynamicTags.push(inputValue)
        this.specList.push({
          name: inputValue,
          thisVal: '',
          item: []
        })
        this.inputValue = ''
      } else {
      }
      this.inputVisible = false
    },

    // 添加规格值
    addSpecValue (val, i) {
      const flag = this.specList[i].item.some(item => {
        return item === val
      })
      if (!flag && val) {
        this.specList[i].item.push(val)
        this.specList[i].thisVal = ''
        this.specData()
      }
    },

    // 规格值表格数据
    specData () {
      if (this.specList.length === 0) {
        this.data1 = []
        return
      }
      const arr = JSON.parse(JSON.stringify(this.specList))
      const data = [] // 最终放入表格的数据
      const res = this.specSku(arr)
      res.forEach(item => {
        data.push({
          spec_val: item,
          spec_img: '',
          spec_price: '',
          spec_stock: '',
          foreign_key: this.goodsForm.foreign_key
        })
      })
      this.data1 = data
    },
    // 处理商品sku
    specSku (arr, arr2) {
      let result = [] // 返回组装后的数据
      const templist = arr
      const first = templist.splice(0, 1)

      if ((arr2 || null) == null) arr2 = []

      if (arr2.length >= 1) {
        for (const i in arr2) {
          for (const k in first[0].item) {
            result.push(arr2[i] + ',' + first[0].item[k])
          }
        }
      } else {
        for (const k in first[0].item) {
          result.push(first[0].item[k])
        }
      }

      // 递归
      if (arr.length >= 1) {
        result = this.specSku(arr, result)
      }

      return result
    },

    // 规格表格图片上传 ==> 成功后
    successSpecImg (file, f, l, val) {
      const index = this.data1.findIndex(item => {
        return item.spec_val === val
      })
      this.data1[index].spec_img = file.fileUrl
    },
    // 规格表格图片上传 ==> 移除
    removeSpecImg (file, f, val) {
      const index = this.data1.findIndex(item => {
        return item.spec_val === val
      })
      this.data1[index].spec_img = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.addProduct-box {
  width: 100%;
  height: 100%;
  // padding: 50px;
  background-color: #fff;
}
.goods_header {
  padding-top: 30px;
}
.goods_body {
  margin: 30px 100px 0 40px;
  padding-bottom: 75px;
  .goods_list_info {
    padding-right: 500px;
  }
  .spec-title {
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    font-size: 18px;
    color: #333;
  }
  .addSpec {
    display: flex;
    align-items: center;
    margin: 10px 0;
    span {
      margin-right: 7px;
    }
    .span {
      min-width: 60px;
      margin-right: 10px;
    }
    .addSpec-item {
      display: flex;
    }
  }
  .addSpecValue {
    display: flex;
    align-items: center;
    margin: 10px 0;
    cursor: pointer;
    .span {
      min-width: 60px;
      margin-right: 10px;
    }
    span {
      margin-right: 7px;
    }
  }
  .sepec-data {
    margin: 35px 400px 35px 0;
  }
  .sepec-data {
    padding-right: 249px;
  }
  .saveProduct {
    margin: 20px 0;
  }
}
</style>
