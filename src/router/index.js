import Vue from 'vue'
import VueRouter from 'vue-router'

// login
const Login = () =>
  import(
    /* webpackChunkName: "login_home_welcome" */ '../views/user/Login.vue'
  )

// home
const Home = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../views/Home.vue')

// welcome
const Welcome = () =>
  import(
    /* webpackChunkName: "login_home_welcome" */ '../views/user/Welcome.vue'
  )

// 角色管理
const Roles = () =>
  import(
    /* webpackChunkName: "roles_rights_menu" */ '../views/system/Roles.vue'
  )
// 权限管理
const Rights = () =>
  import(
    /* webpackChunkName: "roles_rights_menu_user-admin" */ '../views/system/Rights.vue'
  )
// 菜单管理
const Menu = () =>
  import(
    /* webpackChunkName: "roles_rights_menu_user-admin" */ '../views/system/Menu.vue'
  )
  // 用户管理-系统管理
const UserAdmin = () =>
  import(
  /* webpackChunkName: "roles_rights_menu_user-admin" */ '../views/system/User-admin.vue'
  )

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/menu', component: Menu },
      { path: '/user-admin', component: UserAdmin }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航卫士
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')
  next()
})

export default router
