import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: () =>
            import ('@/views/qna/QnaInfoList.vue')
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/AboutView.vue')
    },
    {
        path: '*',
        component: () =>
            import ( /* webpackChunkName: "group-error-404" */ '@/views/error/404.vue')
    },
    {
        path: '/customer/qnalist',
        name: 'qnaList',
        component: () =>
            import ('@/views/qna/QnaInfoList.vue')
    },
    {
        path: '/customer/qnaDetail',
        name: 'qnaDetail',
        component: () =>
            import ('@/views/qna/QnaInfoDetail.vue')
    },
    {
        path: '/csr/login',
        name: 'login',
        component: () =>
            import ('@/views/csr/Login.vue')
    },
    {
        path: '/csr/qnalist',
        name: 'csrQnaList',
        component: () =>
            import ('@/views/csr/CsrQnaInfoList.vue')
    },
    {
        path: '/csr/qnaDetail',
        name: 'csrQnaDetail',
        component: () =>
            import ('@/views/csr/CsrQnaInfoDetail.vue')
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router