<template>
  <div>
    <div class="header">
      <el-button
        @click="(dialogVisible = true), (flag = true)"
        type="primary"
        size="small"
        icon="el-icon-circle-plus-outline"
        >添加导航</el-button
      >
    </div>
    <div class="body">
      <el-table
        ref="multipleTable"
        :data="navigatorList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          prop="navigator_icon"
          width="200"
          label="导航图标"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-image
              style="width: 60px"
              :src="scope.row.navigator_icon"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="navigator_name"
          width="200"
          label="导航名称"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="navigator_url"
          label="链接地址"
          width="500"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="sort"
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
          <el-form-item label="导航名称" prop="navigator_name">
            <el-input
              placeholder="请填写广告名称"
              v-model="advertForm.navigator_name"
            ></el-input>
          </el-form-item>
          <el-form-item label="链接地址" prop="navigator_url">
            <el-input
              placeholder="请填写导航链接地址"
              v-model="advertForm.navigator_url"
            ></el-input>
          </el-form-item>
          <el-form-item label="导航图标" prop="navigator_icon">
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
          <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="advertForm.sort"
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
      // 导航列表
      navigatorList: [],

      // 导航数据对象
      advertForm: {
        navigator_icon: '',
        navigator_name: '',
        navigator_url: '',
        sort: 0,
        state: 1
      },
      rulesAdvertForm: {
        navigator_name: [
          { required: true, message: '请填写导航名称', trigger: 'blur' }
        ],
        navigator_url: [
          { required: true, message: '请填写导航链接地址', trigger: 'blur' }
        ],
        navigator_icon: [
          { required: true, message: '请上传导航图标', trigger: 'blur' }
        ]
      },

      // 查看图片
      dialogImg: false,
      // 图片地址
      dialogImageUrl: '',
      img_list: [],

      // 图片上传地址
      action: 'http://127.0.0.1:3008/upload',
      id: '',

      // 添加编辑导航
      dialogVisible: false,
      flag: true
    }
  },
  created () {
    this.getNavigator()
  },
  methods: {
    // 导航列表
    async getNavigator () {
      const { data: res } = await this.$axios.get('getNavigator')
      this.navigatorList = res.data
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
          this.getNavigator()
          this.dialogVisible = false
          this.$refs.upload.clearFiles()
        }
      })
    },
    // 添加导航
    async addAdvert () {
      const { data: res } = await this.$axios.post(
        'addNavigator',
        this.advertForm
      )
      const type = res.status === 201 ? 'success' : 'error'
      this.$message({ message: res.msg, type })
      this.clearAdvert()
    },
    // 编辑导航
    async modifyAdvert () {
      const { data: res } = await this.$axios.post(
        `modifyNavigator?id=${this.id}`,
        this.advertForm
      )
      const type = res.status === 201 ? 'success' : 'error'
      this.$message({ message: res.msg, type })
      this.clearAdvert()
      this.getNavigator()
    },

    // 编辑
    editAdvert (item) {
      const advertInfo = JSON.parse(JSON.stringify(item))
      this.id = advertInfo.id
      delete advertInfo.id
      this.flag = false
      this.dialogVisible = true
      this.advertForm = advertInfo
      this.img_list = [{ url: advertInfo.navigator_icon }]
    },

    // 开关修改导航信息
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
      this.advertForm.navigator_icon = ''
      this.advertForm.navigator_name = ''
      this.advertForm.navigator_url = ''
      this.advertForm.sort = 0
      this.advertForm.state = 1
      this.img_list = []
    },

    // 删除导航
    delAdvert (item) {
      this.$confirm(
        `你确定要删除 【${item.navigator_name} 】 该导航吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        const { data: res } = await this.$axios.get(`delNavigator?id=${item.id}`)
        const type = res.status === 201 ? 'success' : 'error'
        this.$message({ message: res.msg, type })
        this.getNavigator()
      })
    },

    // 查看已经上传的图片
    previewImg (file) {
      this.dialogImg = true
      this.dialogImageUrl = file.url
    },
    // 移出文件列表
    removeImg () {
      this.advertForm.navigator_icon = ''
    },
    // 图片上传成功
    successImg (response) {
      this.advertForm.navigator_icon = response.fileUrl
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
