import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainView from '../views/MainView.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'main',
  component: MainView
},
{
  path: '/login',
  name: 'userLogin',
  component: HomeView
},
{
  path: '/about',
  name: 'about',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () =>
    import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
},
{
  path: '/admin/login',
  name: 'adminLogin',
  component: () =>
    import('@/views/admin/AdminLoginView.vue')
},
{
  path: '/admin',
  name: 'adminDashboard',
  component: () =>
    import('@/views/admin/AdminDashboardView.vue')
},
{
  path: '/admin/products',
  name: 'adminProductList',
  component: () => import('@/views/admin/product/AdminProductListView.vue')
},
{
  path: '/admin/products/new',
  name: 'adminProductCreate',
  component: () => import('@/views/admin/product/AdminProductCreateView.vue')
},
{
  path: '/admin/products/:productNo',
  name: 'adminProductDetail',
  component: () => import('@/views/admin/product/AdminProductDetailView.vue')
},
{
  path: '/customer/qnalist',
  name: 'qnaList',
  component: () =>
    import('@/views/qna/QnaInfoList.vue')
},
{
  path: '/customer/qnaDetail',
  name: 'qnaDetail',
  component: () =>
    import('@/views/qna/QnaInfoDetail.vue')
},
{
  path: '/csr',
  name: 'csrInquiry',
  redirect: { name: 'qnaList' }
},
{
  path: '/csr/login',
  name: 'login',
  component: HomeView
},
{
  path: '/user/join',
  name: 'userJoin',
  component: () =>
    import('@/views/user/UserJoin.vue')
},
{
  path: '/user/profile/confirm',
  name: 'userPasswordConfirm',
  component: () =>
    import('@/views/user/UserPasswordConfirm.vue')
},
{
  path: '/user/profile/edit',
  name: 'userInfoEdit',
  component: () =>
    import('@/views/user/UserInfoEdit.vue')
},
{
  path: '/main',
  redirect: { name: 'main' }
},
{
  path: '/csr/qnalist',
  name: 'csrQnaList',
  component: () =>
    import('@/views/csr/CsrQnaInfoList.vue')
},
{
  path: '/csr/qnaDetail',
  name: 'csrQnaDetail',
  component: () =>
    import('@/views/csr/CsrQnaInfoDetail.vue')
},
{
  path: '*',
  component: () =>
    import(/* webpackChunkName: "group-error-404" */ '@/views/error/404.vue')
}

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const protectedRoutes = ['csrInquiry', 'qnaList', 'qnaDetail', 'csrQnaList', 'csrQnaDetail', 'userPasswordConfirm', 'userInfoEdit']
  const adminProtectedRoutes = ['adminDashboard', 'adminProductList', 'adminProductCreate', 'adminProductDetail']

  if (adminProtectedRoutes.includes(to.name) && !localStorage.getItem('adminAccessToken')) {
    next({ name: 'adminLogin' })
    return
  }

  if (to.name === 'adminLogin' && localStorage.getItem('adminAccessToken')) {
    next({ name: 'adminDashboard' })
    return
  }

  if (to.name === 'userLogin' && localStorage.getItem('accessToken')) {
    next({ name: 'main' })
    return
  }

  if (protectedRoutes.includes(to.name) && !localStorage.getItem('accessToken')) {
    next({ name: 'userLogin' })
    return
  }

  next()
})

export default router
