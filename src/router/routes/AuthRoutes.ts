import type { RouteRecordRaw } from 'vue-router';

const route: RouteRecordRaw = {
    path: '/',
    component: () => import('@views/AuthView.vue'),
    children: [
        {
            path: '',
            name: 'home',
            component: () => import('@views/HomeView.vue'),
            meta: {
                title: 'home',
                auth: true
            }
        },

        {
            path: 'qr',
            name: 'qr',
            component: () => import('@views/ScanView.vue'),
            meta: {
                permissions: ['camera'],
                title: 'qr',
                auth: true
            }
        },

        {
            path: 'menu',
            children: [
                {
                    path: '',
                    name: 'menu',
                    component: () => import('@views/MenuView.vue'),
                    meta: {
                        title: 'menu',
                        auth: true
                    },
                },
                {
                    path: 'library/add',
                    name: 'library-create',
                    component: () => import('@views/AddLibraryView.vue'),
                    meta: {
                        auth: true
                    }
                },
                {
                    path: 'book/add',
                    name: 'add-book',
                    component: () => import('@views/AddBookView.vue'),
                    meta: {
                        auth: true
                    }
                }
            ]
        },

        {
            path: 'search',
            name: 'search',
            component: () => import('@views/HomeView.vue'),
            meta: {
                title: 'search',
                auth: true
            }
        }
    ]
}

export default route