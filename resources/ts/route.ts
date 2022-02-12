import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/pages/Layout.vue'
import LoginPage from '@/pages/LoginPage.vue'
import GamePage from '@/pages/GamePage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        component: LoginPage,
      },
      {
        path: 'game',
        component: GamePage,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
