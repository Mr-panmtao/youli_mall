<template>
  <div class="container">
    <div class="header">
      <el-button
        @click="(dialogCategory = true), (flag = true)"
        type="primary"
        size="small"
        icon="el-icon-circle-plus-outline"
        >添加分类</el-button
      >
    </div>
    <div class="body">
      <TreeTable
        :data="category_list"
        :columns="columns"
        show-index
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        border
      >
        <!-- 分类图片 -->
        <template slot="cat_img" slot-scope="scope">
          <el-image
            :style="
              scope.row.cat_pid === 0
                ? 'width: 132px; height: 50px;border-radius:5px'
                : 'width: 50px; height: 50px;border-radius:5px'
            "
            :src="scope.row.cat_img"
          ></el-image>
        </template>
        <!-- 分类级别 -->
        <template slot="cat_level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 1">一 级</el-tag>
          <el-tag v-else type="success">二 级</el-tag>
        </template>
        <!-- 是否有效 -->
        <template slot="cat_isEnable" slot-scope="scope">
          <i
            v-if="scope.row.cat_isEnable === 1"
            class="el-icon-success"
            style="fontSize:20px;color:#67C23A"
          ></i>
          <i
            v-else
            class="el-icon-error"
            style="fontSize:20px;color:#F56C6C"
          ></i>
        </template>
        <!-- 操作 -->
        <template slot="tpl" slot-scope="scope">
          <el-button
            @click="editCategory(scope.row)"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            >编辑</el-button
          >
          <el-button
            @click="delCategory(scope.row)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            >删除</el-button
          >
        </template>
      </TreeTable>
    </div>

    <!-- 添加分类 dialog -->
    <el-dialog
      :title="flag ? '添加分类' : '编辑分类'"
      :visible.sync="dialogCategory"
      width="40%"
      @close="clearCategory"
    >
      <div class="category-info">
        <el-form
          :model="categoryForm"
          :rules="categoryRules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left"
        >
          <el-form-item label="上级分类" prop="region">
            <el-select
              v-model="categoryForm.cat_pid"
              placeholder="请选择父级分类"
            >
              <el-option label="顶级分类" value="0"></el-option>
              <el-option
                v-for="item in category_list"
                :key="item.id"
                :label="item.cat_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类名称" prop="cat_name">
            <el-input
              placeholder="请填写分类名称"
              v-model="categoryForm.cat_name"
            ></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="cat_sort">
            <el-input-number
              v-model="categoryForm.cat_sort"
              :min="1"
              :max="100"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="分类图片" prop="cat_img">
            <div class="upload">
              <el-upload
                :action="action"
                list-type="picture-card"
                :on-preview="previewImg"
                :on-success="successImg"
                :on-remove="removeImg"
                :limit="1"
                ref="upload"
                :file-list="img_list"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
            <el-dialog :visible.sync="dialogImg">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>

          <el-form-item label="是否启用">
            <el-switch
              :inactive-value="0"
              :active-value="1"
              inactive-text="禁用"
              active-text="启用"
              v-model="categoryForm.cat_isEnable"
            ></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearCategory">取 消</el-button>
        <el-button type="primary" @click="saveCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      category_list: [],
      // 表格各列的数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '分类图片',
          type: 'template',
          template: 'cat_img'
        },
        {
          label: '分类级别',
          type: 'template',
          template: 'cat_level'
        },
        {
          label: '排序',
          prop: 'cat_sort'
        },
        {
          label: '是否启用',
          type: 'template',
          template: 'cat_isEnable'
        },
        {
          label: '操作',
          type: 'template',
          template: 'tpl'
        }
      ],

      // 添加 、编辑分类dialog
      dialogCategory: false,
      flag: true,

      // 分类数据对象
      categoryForm: {
        cat_name: '',
        cat_img: '',
        cat_sort: '',
        cat_isEnable: 1,
        cat_level: '',
        cat_pid: '0'
      },
      categoryRules: {
        cat_name: [
          { required: true, message: '请填写分类名称', trigger: 'blur' }
        ],
        cat_img: [
          { required: true, message: '请上传分类图片', trigger: 'blur' }
        ],
        cat_sort: [
          { required: true, message: '请填写分类排序值', trigger: 'blur' }
        ]
      },
      // 图片上传地址
      action: 'http://127.0.0.1:3008/upload',
      //   上传图片相关
      dialogImg: false,
      dialogImageUrl: '',
      // 编辑用户显示的头像
      img_list: [],
      category_id: ''
    }
  },
  created () {
    this.getCategory()
  },
  methods: {
    // 获取分类数据
    async getCategory () {
      const { data: res } = await this.$axios.get('getCategory')
      this.category_list = res.data
    },

    // 操作分类
    saveCategory () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // 设置分类等级
          this.categoryForm.cat_level =
            this.categoryForm.cat_pid === '0' ? 1 : 2
          // 添加分类
          if (this.flag) {
            this.addCategory()
          } else {
            // 编辑分类
            this.modifyCategory()
          }
          this.getCategory()
          this.dialogCategory = false
          this.$refs.ruleForm.resetFields()
          this.$refs.upload.clearFiles()
        }
      })
    },

    // 添加分类
    async addCategory () {
      const { data: res } = await this.$axios.post(
        'addCategory',
        this.categoryForm
      )
      const type = res.status === 201 ? 'success' : 'error'
      this.$message({ message: res.msg, type })
    },

    // 编辑分类
    async modifyCategory () {
      const { data: res } = await this.$axios.post(
        `modifyCategory?id=${this.category_id}`,
        this.categoryForm
      )
      const type = res.status === 201 ? 'success' : 'error'
      this.$message({ message: res.msg, type })
    },

    // 编辑分类
    editCategory (item) {
      const info = JSON.parse(JSON.stringify(item))
      if (info.cat_pid === 0) {
        info.cat_pid = info.cat_pid.toString()
      }
      this.img_list = [{ url: info.cat_img }]
      this.dialogCategory = true
      this.flag = false
      this.categoryForm.cat_name = info.cat_name
      this.categoryForm.cat_img = info.cat_img
      this.categoryForm.cat_sort = info.cat_sort
      this.categoryForm.cat_isEnable = info.cat_isEnable
      this.categoryForm.cat_level = info.cat_level
      this.categoryForm.cat_pid = info.cat_pid
      this.category_id = info.id
    },

    // 查看已经上传的图片
    previewImg (file) {
      this.dialogImg = true
      this.dialogImageUrl = file.url
    },
    // 移出文件列表
    removeImg () {
      this.categoryForm.cat_img = ''
    },
    // 图片上传成功
    successImg (response) {
      this.categoryForm.cat_img = response.fileUrl
    },

    // 删除分类
    delCategory (item) {
      this.$confirm(`你确定要删除 【${item.cat_name} 】 该分类吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (item.children.length >= 1) {
          return this.$message({
            message: `【${item.cat_name}】包含子分类，无法删除`,
            type: 'error'
          })
        }
        const { data: res } = await this.$axios.get(
          `delCategory?id=${item.id}`
        )
        const type = res.status === 201 ? 'success' : 'error'
        this.$message({ message: res.msg, type })
        this.getCategory()
      })
    },

    // 清空绑定数据
    clearCategory () {
      this.dialogCategory = false
      this.categoryForm.cat_name = ''
      this.categoryForm.cat_img = ''
      this.categoryForm.cat_sort = ''
      this.categoryForm.cat_isEnable = 1
      this.categoryForm.cat_level = ''
      this.categoryForm.cat_pid = '0'
      this.img_list = []
      this.$refs.ruleForm.resetFields()
      this.$refs.upload.clearFiles()
    }
  }
}
</script>
<style lang="scss" scoped>
.category-info {
  padding: 0 249px 0 50px;
}
</style>
