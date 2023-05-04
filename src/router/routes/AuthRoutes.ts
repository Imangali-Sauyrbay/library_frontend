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
            }
        },

        {
            path: 'scan',
            name: 'scan',
            component: () => import('@views/ScanView.vue'),
            meta: {
                permissions: ['camera'],
                title: 'scan',
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
                    },
                },
                {
                    path: 'library/add',
                    name: 'library-create',
                    component: () => import('@views/AddLibraryView.vue'),
                    meta: {
                    }
                },
                {
                    path: 'book/add',
                    name: 'add-book',
                    component: () => import('@views/AddBookView.vue'),
                    meta: {
                    }
                }
            ]
        },

        {
            path: 'search',
            name: 'search',
            component: () => import('@views/SearchBookView.vue'),
            meta: {
                title: 'search',
            }
        }
    ]
}

export default route