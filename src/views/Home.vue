<template>
  <el-container class="home-container">
    <!-- :width="stretch ? 64 + 'px' : 240 + 'px'" actives -->
    <el-aside :class="stretch ? 'actives' : 'noactives'">
      <div class="aside-header" v-show="!stretch" @click="goIndex">
        <img src="../assets/logo.381d6a3e.png" alt="" srcset="" />
        <span>UNI-ADMIN</span>
      </div>
      <div class="nosstretch">
        <img
          v-show="stretch"
          src="../assets/logo.381d6a3e.png"
          alt=""
          srcset=""
        />
      </div>
      <el-menu
        :default-active="isChcked"
        background-color="#304156"
        text-color="#fff"
        unique-opened
        active-text-color="#287FFF"
        router
        :collapse="stretch"
        :collapse-transition="false"
      >
        <el-submenu
          v-show="item.children.length >= 1"
          :index="item.id.toString()"
          v-for="(item, index) in menu_list"
          :key="index"
        >
          <template slot="title">
            <i :class="item.menu_icon"></i>
            <span>{{ item.menu_name }}</span>
          </template>
          <el-menu-item
            @click="
              isChecked(
                {
                  title: item1.menu_name,
                  path: item1.menu_url,
                  status: true
                },
                index1
              )
            "
            :index="item1.menu_url"
            v-for="(item1, index1) in item.children"
            :key="item1.id"
            >{{ item1.menu_name }}</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="left-nav">
          <div class="stretch" @click="stretch = !stretch">
            <i v-show="!stretch" class="el-icon-s-fold"></i>
            <i v-show="stretch" class="el-icon-s-unfold"></i>
          </div>
            <el-button icon="el-icon-refresh-right" @click="Refresh"  type="primary" size="mini">刷 新</el-button>
            <!-- <el-button  icon="el-icon-back" @click="upper" type="primary"  size="mini"> 返 回 </el-button> -->
        </div>
        <div class="userInfo">
          <el-dropdown @command="handleCommand">
            <img :src="userInfo.user_img" alt="" srcset="" />
            <span class="el-dropdown-link">
              {{ userInfo.role_name
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="updatePwd">修改密码</el-dropdown-item>
              <el-dropdown-item command="exit">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <div class="tag-wrap">
        <div class="header-tag" v-for="(item, i) in tagNaveList" :key="i">
          <el-tag
            size="medium"
            :closable="i >= 1 ? true : false"
            :effect="item.status ? 'dark' : 'light'"
            :color="!item.status ? '#fff' : ''"
            :style="!item.status ? 'color:#495060' : ''"
            @click="tagClick(item)"
            @close="tagClose(item)"
          >
            {{ item.title }}
          </el-tag>
        </div>
      </div>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-dialog title="修改密码" :visible.sync="pwdDialog" width="30%">
      <el-form
        :model="pwdForm"
        :rules="pwdrules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="旧密码" prop="usedPwd">
          <el-input
            style="width:300px"
            size="small"
            placeholder="请输入旧密码"
            show-password
            v-model="pwdForm.usedPwd"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input
            style="width:300px"
            size="small"
            placeholder="请输入新密码"
            show-password
            v-model="pwdForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input
            style="width:300px"
            size="small"
            placeholder="请再次输入新密码"
            show-password
            v-model="pwdForm.confirmPwd"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pwdDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      // 菜单栏
      menu_list: [],
      // 用户数据对象
      userInfo: {},
      // 菜单栏伸缩
      stretch: false,
      //   tag是否显示
      isShowClose: false,
      // 侧边栏某一项选中
      isChcked: '',
      // 头部路由导航
      tagNaveList: [],
      // 修改密码
      pwdDialog: false,
      // 密码数据对象
      pwdForm: {
        usedPwd: '',
        password: '',
        // 确认密码
        confirmPwd: ''
      },
      pwdrules: {
        usedPwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    this.tagNaveList = this.getMenu()

    const info = this.getTagNaveList()

    if (info !== null) {
      const activeTag = info.filter(item => {
        return item.status === true
      })
      this.$router.push(activeTag[0].path)
    }

    if (info === null || info === '') {
      window.sessionStorage.setItem(
        'tagNaveList',
        JSON.stringify([{ title: '首页', path: 'home', status: true }])
      )
    }
    this.tagNaveList = JSON.parse(window.sessionStorage.getItem('tagNaveList'))
    this.isChcked = window.sessionStorage.getItem('isChcked')
  },
  methods: {
    // 获取菜单栏数据
    async getMenu () {
      const { data: res } = await this.$axios.get('getMenu')
      this.menu_list = res.data
    },

    // 获取tagNaveList
    getTagNaveList () {
      const navInfo = JSON.parse(window.sessionStorage.getItem('tagNaveList'))
      return navInfo
    },
    // 侧边栏某一项选中
    menuActive (value) {
      window.sessionStorage.setItem('isChcked', value)
    },

    // 侧边栏点击
    isChecked (info, index) {
      let navInfo = this.getTagNaveList()
      this.menuActive(info.path)

      if (navInfo === null || navInfo === '') {
        navInfo = []
      }

      const falg = navInfo.some(item => {
        return item.path === info.path
      })

      navInfo.forEach(item => {
        item.status = false
      })

      if (!falg) {
        navInfo.push(info)
      } else {
        const index = navInfo.findIndex(item => {
          return item.path === info.path
        })
        navInfo[index].status = true
      }
      this.tagNaveList = navInfo
      window.sessionStorage.setItem('tagNaveList', JSON.stringify(navInfo))
    },

    // tag
    tagClick (item) {
      this.isChcked = item.path
      this.menuActive(item.path)
      this.isChecked(item)
      this.$router.push(item.path)
    },
    tagClose (info) {
      const navInfo = this.getTagNaveList()
      const index = navInfo.findIndex(item => {
        return item.path === info.path
      })
      navInfo.splice(index, 1)
      // 如果删除的是最后一个tag并且是选中状态
      if (index === navInfo.length && info.status === true) {
        navInfo[index - 1].status = true
        this.$router.push(navInfo[index - 1].path)
        this.isChcked = navInfo[index - 1].path
        this.menuActive(this.isChcked)
      }
      this.tagNaveList = navInfo
      window.sessionStorage.setItem('tagNaveList', JSON.stringify(navInfo))
    },
    //
    goIndex () {
      this.$router.push('/home')
    },

    handleCommand (command) {
      if (command === 'exit') {
        this.$confirm('你确定要退出登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          window.sessionStorage.removeItem('token')
          window.sessionStorage.removeItem('userInfo')
          Cookies.remove('userRole')
          this.$router.push('/login')
        })
      }
      if (command === 'updatePwd') {
        this.pwdDialog = true
      }
    },

    // 修改密码
    submitForm () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (this.pwdForm.password !== this.pwdForm.confirmPwd) {
            return this.$message({
              message: '两次输入的密码不一致',
              type: 'error'
            })
          }
          const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
          const { data: res } = await this.$axios.post('modifyPwd', {
            id: userInfo.id,
            usedPwd: this.pwdForm.usedPwd,
            password: this.pwdForm.password
          })
          const type = res.status === 201 ? 'success' : 'error'
          this.$message({ message: res.msg, type })
          if (res.status === 201) {
            this.$refs.ruleForm.resetFields()
            this.pwdDialog = false
          }
        }
      })
    },

    // 刷新
    Refresh () {
      this.$router.go(0)
    },
    // 上一级
    upper () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.home-container {
  height: 100%;
  width: 100%;
}
.el-header {
  height: 50px !important;
  display: flex;
  padding: 0 10px 0 0;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  color: #333;

  .left-nav {
    height: 100%;
    display: flex;
    align-items: center;
    color: #495060;
    .stretch {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      font-size: 20px;
      width: 50px;
      height: 100%;
      cursor: pointer;
    }
    .stretch:hover {
      background:rgba(0,0,0,.025);
    }
  }

  .userInfo {
    .el-dropdown {
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        width: 34px;
        margin-right: 7px;
        border-radius: 50%;
      }
    }
  }
}
.tag-wrap {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 8px 10px;
  box-sizing: border-box;
  background-color: #f2f3f4;
  .el-tag {
    margin-right: 6px;
    padding: 0 12px;
    cursor: pointer;
  }
}
.el-aside {
  background-color: #304156;
  color: #333;
  .aside-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    margin-top: 10px;
    letter-spacing: 2px;
    font-size: 20px;
    cursor: pointer;
    color: #fff;
    img {
      width: 50px;
      margin-right: 10px;
    }
  }
  .el-menu {
    border-right: 0 !important;
  }
}
.nosstretch {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 50px;
  }
}
.actives {
  width: 64px !important;
  transition: all 0.5s;
}
.noactives {
  width: 220px !important;
  transition: all 0.5s;
}
.el-main {
  padding: 0 10px 10px 10px;
  background-color: #f2f3f4;
  color: #333;
}
</style>
