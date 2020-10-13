<template>
  <div class="user-container">
    <div class="user-header">
      <el-button
        @click="(dialogUser = true), (flag = true)"
        type="primary"
        size="small"
        icon="el-icon-circle-plus-outline"
        >添加用户</el-button
      >
    </div>
    <div class="user-body">
      <el-table :data="user_list" style="width: 100%">
        <el-table-column
          type="index"
          align="center"
          label="#"
          width="100px"
        ></el-table-column>
        <el-table-column prop="user_img" align="center" label="用户头像">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.user_img"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" align="center" label="用户名">
        </el-table-column>
        <el-table-column prop="role_name" align="center" label="所属角色">
        </el-table-column>
        <el-table-column prop="is_enabled" align="center" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_enabled"
              :active-value="1"
              :inactive-value="0"
              @change="tagChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" width="380" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="modifyUser(scope.row)"
              >编辑</el-button
            >

            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delUser(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加用户 / 编辑用户 -->

    <el-dialog
      :title="flag ? '添加用户' : '编辑用户'"
      :visible.sync="dialogUser"
      width="30%"
      @close="clearUser"
    >
      <div class="userInfo">
        <el-form
          :model="userForm"
          :rules="userRules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left"
        >
          <el-form-item label="用户角色" prop="role_id">
            <el-select
              style="width:100%"
              v-model="userForm.role_id"
              placeholder="请选择用户角色"
            >
              <el-option
                v-for="item in roles_list"
                :key="item.id"
                :label="item.role_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input
              placeholder="请填写用户名"
              v-model="userForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item v-show="flag" label="密码" prop="password">
            <el-input
              placeholder="请填写用户密码"
              v-model="userForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="用户头像" prop="user_img">
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
          <el-form-item label="是否启用" prop="is_enabled">
            <el-switch
              v-model="userForm.is_enabled"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearUser">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      user_list: [],
      roles_list: [],
      // 添加 编辑
      dialogUser: false,
      flag: true,

      // 添加用户数据对象
      userForm: {
        username: '',
        password: '',
        user_img: '',
        is_enabled: 1,
        role_id: ''
      },
      userRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ],
        user_img: [
          { required: true, message: '请上传用户头像', trigger: 'blur' }
        ],
        role_id: [
          { required: true, message: '请上传用户头像', trigger: 'change' }
        ]
      },

      // 图片上传地址
      action: 'http://127.0.0.1:3008/upload',
      //   上传图片相关
      dialogImg: false,
      dialogImageUrl: '',
      // 编辑用户显示的头像
      img_list: [],
      user_id: ''
    }
  },
  created () {
    this.getUser()
    this.getRoles()
  },
  methods: {
    // 获取用户信息
    async getUser () {
      const { data: res } = await this.$axios.get('getUser')
      this.user_list = res.data
    },
    // 获取角色
    async getRoles () {
      const { data: res } = await this.$axios.get('getRoles')
      this.roles_list = res.data
    },
    // 查看已经上传的图片
    previewImg (file) {
      this.dialogImg = true
      this.dialogImageUrl = file.url
    },
    // 移出文件列表
    removeImg () {
      this.userForm.user_img = ''
    },
    // 图片上传成功
    successImg (response) {
      this.userForm.user_img = response.fileUrl
    },

    // 添加用户 / 编辑用户
    saveUser () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (this.flag) {
            this.addUser()
          } else {
            this.edityUser()
          }
          this.getUser()
          this.clearUser()
        }
      })
    },
    // 添加用户
    async addUser () {
      const { data: res } = await this.$axios.post('addUser', this.userForm)
      const type = res.status === 201 ? 'success' : 'error'
      this.$message({ message: res.msg, type })
    },
    // 编辑用户api
    async edityUser () {
      const { data: res } = await this.$axios.post(`modifyUser?id=${this.user_id}`, this.userForm)
      const type = res.status === 201 ? 'success' : 'error'
      this.$message({ message: res.msg, type })
    },

    // 开关切换编辑用户信息
    tagChange (item) {
      this.modifyUserInfo(item)
      this.edityUser()
      this.clearUser(true)
      this.getUser()
    },

    // 编辑用户
    modifyUser (item) {
      this.img_list = [{ url: item.user_img }]
      this.dialogUser = true
      this.flag = false
      this.modifyUserInfo(item)
    },

    // 删除用户
    delUser (item) {
      this.$confirm(
        `你确定要删除 【${item.username} 】 该用户吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        if (item.id === 1) {
          return this.$message({
            message: `不允许删除【${item.username}】`,
            type: 'error'
          })
        }
        const { data: res } = await this.$axios.get(`delUser?id=${item.id}`)
        const type = res.status === 201 ? 'success' : 'error'
        this.$message({ message: res.msg, type })
        this.getUser()
      })
    },

    // 为用户数据对象赋值
    modifyUserInfo (item) {
      this.userForm.username = item.username
      this.userForm.user_img = item.user_img
      this.userForm.password = item.password
      this.userForm.is_enabled = item.is_enabled
      this.userForm.role_id = item.role_id
      this.user_id = item.id
    },

    // 清空用户数据对象
    clearUser (flag) {
      this.dialogUser = false
      this.userForm.username = ''
      this.userForm.password = ''
      this.userForm.user_img = ''
      this.userForm.is_enabled = 1
      this.userForm.role_id = ''
      if (flag) return
      this.$refs.ruleForm.resetFields()
      this.$refs.upload.clearFiles()
    }
  }
}
</script>
<style lang="scss" scoped>
.user-container {
  width: 100%;
  height: 100%;

  .user-header {
    padding: 10px;
    background-color: #fff;
  }
  .user-body {
    margin-top: 10px;
  }
  .userInfo {
    padding: 0 90px 0 30px;
  }
}
</style>
