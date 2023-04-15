import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   {
    path: '/welcome',
    component: () => import('@/views/WelcomeView.vue'),
    name: 'welcome'
   },
   {
    path: '/login',
    component: () => import('@/views/LoginView.vue'),
    name: 'login'
   },
   {
    path: '/register',
    component: () => import('@/views/RegisterView.vue'),
    name: 'register'
   }
  ]
})

export default router
