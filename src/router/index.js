import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Events from '../views/Events.vue'
import Profile from '../views/Profile.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/events',
    component: Events
  },
  {
    path: '/profile',
    component: Profile
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
