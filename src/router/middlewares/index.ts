import type { Router } from 'vue-router'
import middlewares from './middlewareProvider'

const initMiddlewares = (router: Router) => {
    middlewares.forEach(({hook, callback}) => {
        switch(hook) {
            case 'afterEach': 
                router.afterEach(callback)
                break
            case 'beforeEach':
                router.beforeEach(callback)
                break
            case 'beforeResolve':
                router.beforeResolve(callback)
                break
        }
    })
}

export {
    initMiddlewares
}