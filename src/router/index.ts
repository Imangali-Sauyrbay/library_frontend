import { createRouter, createWebHistory } from 'vue-router'
import { initMiddlewares } from './middlewares'
import routes from './routes'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

initMiddlewares(router)

export default router
