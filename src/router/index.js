import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/login/Login.vue'
import Home from '../views/home/Home.vue'
import Layout from '../views/layout/Layout.vue'
import Article from '../views/article/Article.vue'
import Publish from '../views/publish/Publish.vue'
import Image from '../views/image/Image.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
      },
      {
        path: '/article',
        name: 'Article',
        component: Article,
      },
      {
        path: '/publish',
        name: 'Publish',
        component: Publish,
      },
      {
        path: '/image',
        name: 'Image',
        component: Image,
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由导航守卫
router.beforeEach((to,from,next)=>{
  const user = JSON.parse(window.localStorage.getItem('user'))
  if(to.path !== '/login'){
    if(user){
      next()
    }else {
      next('/login')
    }
  }else {
    next()
  }
})
export default router
