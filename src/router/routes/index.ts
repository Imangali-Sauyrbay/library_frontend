import type { RouteRecordRaw } from 'vue-router'

import AuthRoutes from './AuthRoutes'
import GuestRoutes from './GuestRoutes'
import WelcomePage from './WelomePage'

const routes: RouteRecordRaw[] = [
    WelcomePage,
    AuthRoutes,
    GuestRoutes,
    {
        path: '/:path(.*)*',
        component: () => import('@views/NotFound.vue'),
        meta: {
            title: 'notFound'
        }
    }
]

export default routes