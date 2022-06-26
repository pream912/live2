import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../views/Home.vue'
import Events from '../views/Events.vue'
import Profile from '../views/Profile.vue'
import Video from '../views/Video.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Events
  },
  {
    path: '/events',
    component: Events
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    path: '/video',
    component: Video
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
