<template>
  <div>
    <div class="header">
      <el-button
        @click="(dialogVisible = true), (flag = true)"
        type="primary"
        size="small"
        icon="el-icon-circle-plus-outline"
        >添加广告</el-button
      >
    </div>
    <div class="body">
      <el-table
        ref="multipleTable"
        :data="advertList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          prop="advert_img"
          width="200"
          label="广告图片"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-image
              style="width: 100%;border-radius: 7px"
              :src="scope.row.advert_img"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="advert_name"
          width="200"
          label="广告名称"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="advert_position"
          label="广告位"
          width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="(scope.row.advert_position === 1)">首页轮播图</span>
            <span v-else>首页中部广告位</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="advert_url"
          label="链接地址"
          width="500"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="advert_sort"
          label="排序"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column align="center" prop="state" label="是否启用">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              :active-value="1"
              :inactive-value="0"
              @change="changeAdvert(scope.row)"
            >
              >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editAdvert(scope.row)"
              >编辑</el-button
            >

            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delAdvert(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加编辑广告 -->
    <el-dialog
      :title="flag ? '添加广告' : '编辑广告'"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <div class="advert-form">
        <el-form
          :model="advertForm"
          :rules="rulesAdvertForm"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left"
        >
          <el-form-item label="广告位" prop="advert_position">
            <el-select
              style="width:100%"
              v-model="advertForm.advert_position"
              placeholder="请选择广告位"
            >
              <el-option label="首页轮播图" :value="1"></el-option>
              <el-option label="首页中部广告位" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="广告名称" prop="advert_name">
            <el-input
              placeholder="请填写广告名称"
              v-model="advertForm.advert_name"
            ></el-input>
          </el-form-item>
          <el-form-item label="链接地址" prop="advert_url">
            <el-input
              placeholder="请填写广告链接地址"
              v-model="advertForm.advert_url"
            ></el-input>
          </el-form-item>
          <el-form-item label="广告图片" prop="advert_img">
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
          <el-form-item label="排序" prop="advert_sort">
            <el-input-number
              v-model="advertForm.advert_sort"
              :min="1"
              :max="100"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch
              :inactive-value="0"
              :active-value="1"
              inactive-text="禁用"
              active-text="启用"
              v-model="advertForm.state"
            ></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="tools">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAdvertForm">确 定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 广告列表
      advertList: [],

      // 添加 、 编辑广告
      flag: true,
      dialogVisible: false,

      // 广告数据对象
      advertForm: {
        advert_position: '',
        advert_name: '',
        advert_url: '',
        advert_img: '',
        advert_sort: 1,
        state: 1
      },
      rulesAdvertForm: {
        advert_position: [
          { required: true, message: '请选择广告位', trigger: 'change' }
        ],
        advert_name: [
          { required: true, message: '请填写广告名称', trigger: 'blur' }
        ],
        advert_url: [
          { required: true, message: '请填写广告链接地址', trigger: 'blur' }
        ],
        advert_img: [
          { required: true, message: '请上传广告图片', trigger: 'blur' }
        ]
      },

      // 查看图片
      dialogImg: false,
      // 图片地址
      dialogImageUrl: '',
      img_list: [],

      // 图片上传地址
      action: 'http://127.0.0.1:3008/upload',
      id: ''
    }
  },
  created () {
    this.getAdvert()
  },
  methods: {
    // 获取轮播图数据
    async getAdvert () {
      const { data: res } = await this.$axios.get('getAdvert')
      this.advertList = res.data
    },
    // 添加编辑广告
    saveAdvertForm () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // 添加广告
          if (this.flag) {
            this.addAdvert()
          } else {
            // 编辑广告
            this.modifyAdvert()
          }
          this.getAdvert()
          this.dialogVisible = false
          this.$refs.upload.clearFiles()
        }
      })
    },
    // 添加广告
    async addAdvert () {
      const { data: res } = await this.$axios.post(
        'addAdvert',
        this.advertForm
      )
      const type = res.status === 201 ? 'success' : 'error'
      this.$message({ message: res.msg, type })
      this.clearAdvert()
    },
    // 编辑广告
    async modifyAdvert () {
      const { data: res } = await this.$axios.post(
        `modifyAdvert?id=${this.id}`,
        this.advertForm
      )
      const type = res.status === 201 ? 'success' : 'error'
      this.$message({ message: res.msg, type })
      this.clearAdvert()
      this.getAdvert()
    },

    // 编辑
    editAdvert (item) {
      const advertInfo = JSON.parse(JSON.stringify(item))
      this.id = advertInfo.id
      delete advertInfo.id
      this.flag = false
      this.dialogVisible = true
      this.advertForm = advertInfo
      this.img_list = [{ url: advertInfo.advert_img }]
    },

    // 开关修改广告信息
    changeAdvert (item) {
      const advertInfo = JSON.parse(JSON.stringify(item))
      this.id = advertInfo.id
      delete advertInfo.id
      this.advertForm = advertInfo
      this.modifyAdvert()
    },

    handleClose () {
      this.dialogVisible = false
      this.clearAdvert()
    },

    clearAdvert () {
      this.advertForm.advert_position = ''
      this.advertForm.advert_name = ''
      this.advertForm.advert_url = ''
      this.advertForm.advert_img = ''
      this.advertForm.advert_sort = 1
      this.advertForm.state = 1
      this.img_list = []
    },

    // 删除广告
    delAdvert (item) {
      this.$confirm(
        `你确定要删除 【${item.advert_name} 】 该广告吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        const { data: res } = await this.$axios.get(`delAdvert?id=${item.id}`)
        const type = res.status === 201 ? 'success' : 'error'
        this.$message({ message: res.msg, type })
        this.getAdvert()
      })
    },

    // 查看已经上传的图片
    previewImg (file) {
      this.dialogImg = true
      this.dialogImageUrl = file.url
    },
    // 移出文件列表
    removeImg () {
      this.advertForm.advert_img = ''
    },
    // 图片上传成功
    successImg (response) {
      this.advertForm.advert_img = response.fileUrl
    }
  }
}
</script>
<style scoped>
.advert-form {
  width: 449px;
  padding-left: 20px;
}
.tools {
  width: 449px;
  display: flex;
  justify-content: center;
}
</style>
