import type { Middleware } from "./types";
import title from '@/composables/title'
import { i18n } from '@/i18n'

const middleware: Middleware = {
    hook: 'beforeResolve',
    callback: (to, from, next) => {
        if(!to.meta.title) {
            to.meta.title = 'home'
        }
    
        title.value = i18n.global.t('app.titles.' + to.meta.title, {page: to.fullPath})
    
        next()
    },
}

export default middleware