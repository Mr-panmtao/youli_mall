<template>
  <div>
    <div class="header">
      <el-button
        @click="(dialogVisible = true), (flag = true)"
        type="primary"
        size="small"
        icon="el-icon-circle-plus-outline"
        >发布公告</el-button
      >
    </div>
    <div class="body">
      <el-table
        ref="multipleTable"
        :data="noticeList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column width="20"> </el-table-column>
        <el-table-column
          prop="notice_title"
          width="300"
          label="公告标题"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="release_time"
          label="发布时间"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.release_time | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          align="center"
          prop="state"
          label="是否启用"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              :active-value="1"
              :inactive-value="0"
              @change="changeNotice(scope.row)"
            >
              >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          width="320"
          align="center"
          label="操作"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editNotice(scope.row)"
              >编辑</el-button
            >

            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delNotice(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="notticeInfo.pageNum"
        background
        :page-sizes="[1, 2, 5, 10]"
        :page-size="notticeInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 添加编辑公告 -->
    <el-dialog
      :title="flag ? '添加公告' : '编辑公告'"
      :visible.sync="dialogVisible"
      width="45%"
      :before-close="handleClose"
    >
      <div class="notice-form">
        <el-form
          :model="noticeForm"
          :rules="noticeRules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left"
        >
          <el-form-item label="公告标题" prop="notice_title">
            <el-input placeholder="请填写公告标题" v-model="noticeForm.notice_title"></el-input>
          </el-form-item>
          <el-form-item label="公告图片" prop="notice_img">
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
          <el-form-item label="公告详情" prop="notice_details">
            <!-- 富文本编辑器 -->
            <quill-editor
              @getEditorData="getEditorData"
              :serviceUrl="action"
              :limit="99"
              :multiple="true"
              :editorVal="noticeForm.notice_details"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch
              :inactive-value="0"
              :active-value="1"
              inactive-text="禁用"
              active-text="启用"
              v-model="noticeForm.state"
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
import quillEditor from '../../components/quillEditor.vue'
export default {
  data () {
    return {
      noticeList: [],

      notticeInfo: {
        pageNum: 1,
        pageSize: 5
      },
      total: 0,

      // 公告数据对象
      noticeForm: {
        notice_title: '',
        notice_img: '',
        notice_details: '',
        state: 1
      },
      noticeRules: {
        notice_title: [
          { required: true, message: '请填写公告标题', trigger: 'blur' }
        ],
        notice_img: [
          { required: true, message: '请上传公告图片', trigger: 'blur' }
        ],
        notice_details: [
          { required: true, message: '请编辑公告详情', trigger: 'blur' }
        ]
      },

      dialogVisible: false,
      flag: true,

      // 查看图片
      dialogImg: false,
      // 图片地址
      dialogImageUrl: '',
      img_list: [],
      id: 0,

      // 图片上传地址
      action: 'http://127.0.0.1:3008/upload'
    }
  },
  components: { 'quill-editor': quillEditor },
  created () {
    this.getNotice()
  },
  methods: {
    // 获取公告列表
    async getNotice () {
      const { data: res } = await this.$axios.post('getNotice', this.notticeInfo)
      this.noticeList = res.data
      this.total = res.total
    },

    // 添加编辑公告
    saveAdvertForm () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // 添加广告
          if (this.flag) {
            this.addNotice()
          } else {
            // 编辑广告
            this.modifyNotice()
          }
          this.getNotice()
          this.dialogVisible = false
          this.$refs.upload.clearFiles()
        }
      })
    },

    // 添加公告
    async addNotice () {
      const { data: res } = await this.$axios.post('addNotice', this.noticeForm)
      const type = res.status === 201 ? 'success' : 'error'
      this.$message({ message: res.msg, type })
      this.getNotice()
      this.clearNotice()
    },
    // 编辑公告
    async modifyNotice () {
      const { data: res } = await this.$axios.post(`modifyNotice?id=${this.id}`, this.noticeForm)
      const type = res.status === 201 ? 'success' : 'error'
      this.$message({ message: res.msg, type })
      this.getNotice()
      this.clearNotice()
    },

    // 编辑公告状态
    changeNotice (item) {
      const noticeInfo = JSON.parse(JSON.stringify(item))
      this.id = noticeInfo.id
      delete noticeInfo.id
      this.noticeForm = noticeInfo
      this.modifyNotice()
    },

    // 页大小发生改变
    handleSizeChange (pageSize) {
      this.notticeInfo.pageSize = pageSize
      this.getNotice()
    },
    // 当前页发生改变
    handleCurrentChange (pageNum) {
      this.notticeInfo.pageNum = pageNum
      this.getNotice()
    },

    handleClose () {
      this.dialogVisible = false
      this.clearNotice()
    },
    // 富文本编辑器获取公告详情
    getEditorData (val) {
      this.noticeForm.notice_details = val
    },

    // 编辑
    editNotice (item) {
      const noticeInfo = JSON.parse(JSON.stringify(item))
      this.id = noticeInfo.id
      delete noticeInfo.id
      this.dialogVisible = true
      this.flag = false
      this.noticeForm = noticeInfo
      this.img_list = [{ url: noticeInfo.notice_img }]
    },

    clearNotice () {
      this.noticeForm.notice_title = ''
      this.noticeForm.notice_img = ''
      this.noticeForm.notice_details = ''
      this.noticeForm.state = 1
      this.img_list = []
    },

    // 删除导航
    delNotice (item) {
      this.$confirm(
        `你确定要删除 【${item.notice_title} 】 该公告吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        const { data: res } = await this.$axios.get(`delNotice?id=${item.id}`)
        const type = res.status === 201 ? 'success' : 'error'
        this.$message({ message: res.msg, type })
        this.getNotice()
      })
    },

    // 查看已经上传的图片
    previewImg (file) {
      this.dialogImg = true
      this.dialogImageUrl = file.url
    },
    // 移出文件列表
    removeImg () {
      this.noticeForm.notice_img = ''
    },
    // 图片上传成功
    successImg (response) {
      this.noticeForm.notice_img = response.fileUrl
    }
  }
}
</script>
<style scoped>
.notice-form {
  padding: 0 50px 0 20px;
}
.tools {
  width: 449px;
  display: flex;
  justify-content: center;
}
</style>
