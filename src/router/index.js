import Vue from 'vue'
import VueRouter from 'vue-router'

// login
const Login = () => import('../views/user/Login.vue')

// home
const Home = () => import('../views/Home.vue')

// welcome
const Welcome = () => import('../views/user/Welcome.vue')

// 角色管理
const Roles = () => import('../views/system/Roles.vue')
// 权限管理
const Rights = () => import('../views/system/Rights.vue')
// 菜单管理
const Menu = () => import('../views/system/Menu.vue')
// 用户管理-系统管理
const UserAdmin = () => import('../views/system/User-admin.vue')

// 商品分类
const Category = () => import('../views/goods/Category.vue')
// 商品管理
const Product = () => import('../views/goods/Product.vue')
// 商品列表
const AddGoods = () => import('../views/goods/addGoods.vue')
// 商品编辑
const updateGoods = () => import('../views/goods/updateGoods.vue')
// 商品评价
const Rating = () => import('../views/goods/Rating.vue')

// 用户列表
const User = () => import('../views/user/User.vue')
// 意见反馈
const Feedback = () => import('../views/user/Feedback.vue')

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
      { path: '/user-admin', component: UserAdmin },
      { path: '/category', component: Category },
      { path: '/product', component: Product },
      { name: 'addGoods', path: '/addGoods', component: AddGoods },
      { name: 'updateGoods', path: '/updateGoods', component: updateGoods },
      { path: '/rating', component: Rating },
      { path: '/user', component: User },
      { path: '/feedback', component: Feedback }
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
