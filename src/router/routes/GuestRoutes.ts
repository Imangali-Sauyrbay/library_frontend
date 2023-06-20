import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
    path: '/',
    component: () => import('@views/GuestView.vue'),
    children: [
        {
            path: 'login',
            component: () => import('@views/LoginView.vue'),
            name: 'login',
            meta: {
                title: 'login'
            }
        },
        {
            path: 'register/:uuid?',
            component: () => import('@views/RegisterView.vue'),
            name: 'register',
            meta: {
                title: 'register'
            }
        },
    ]
}

export default route
