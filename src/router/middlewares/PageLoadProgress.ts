import eventBus from '@/composables/eventBus'
import type { Middleware } from './types'

const middlewares: Middleware[] = [
    {
        hook: 'beforeEach',
        callback: (to, from, next) => {
            const route = to.matched[to.matched.length - 1]
            if (typeof route?.components?.default === 'function') {
                eventBus.emit('asyncComponentLoading')
            }
        
            next()
        }
    },

    {
        hook: 'beforeResolve',
        callback: (to, from, next) => {
            eventBus.emit('asyncComponentLoaded')
            next()
        }
    }
]

export default middlewares