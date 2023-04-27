import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
    path: '/welcome',
    component: () => import('@views/WelcomeView.vue'),
    name: 'welcome',
    meta: {
        title: 'welcome'
    }
}

export default route