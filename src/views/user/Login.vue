<template>
  <div class="login-body">
    <div class="login-box">
      <div class="login-header">
        <img src="../../assets/logo.381d6a3e.png" alt="" srcset="" />
        <span>UNI-ADMIN</span>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label-width="0" label="" prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="ruleForm.username"
            clearable
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="0" label="" prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="ruleForm.password"
            clearable
            show-password
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button
            style="width:100%;margin-top:20px"
            type="primary"
            @click="loginForm"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      ruleForm: {
        username: 'admin',
        password: 'pmtjy'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 登录
    loginForm () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$axios.post(
            'admin_login',
            this.ruleForm
          )
          const type = res.status === 201 ? 'success' : 'error'
          this.$message({ message: res.msg, type })
          if (res.status === 201) {
            // 存储token
            window.sessionStorage.setItem('token', res.token)
            // 存储用户信息
            window.sessionStorage.setItem('userInfo', JSON.stringify(...res.data))
            // 存储角色
            Cookies.set('userRole', res.data[0].r_id)
            this.$router.push('/home')
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login-body {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/bg-login.jpg");
  background-repeat: no-repeat;
  background-size: cover;

  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 360px;
    padding: 20px 50px;
    border-radius: 8px;
    background-color: #fff;

    .login-header {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 25px;
      margin-top: 10px;
      letter-spacing: 2px;
      font-size: 20px;
      img {
        width: 50px;
        margin-right: 10px;
      }
    }
  }
}
.login-body::before {
  content: "";
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
