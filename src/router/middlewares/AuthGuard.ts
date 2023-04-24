import type { Middleware } from "./types"
import authService from '@/services/AuthService'

const WelcomePageName = 'welcome'

const middleware: Middleware = {
    hook: 'beforeEach',
    callback: async (to, _, next) => {
        if(to.meta.auth) {
            try {
                const result = await authService.isUserAuthenthicated()

                if(result.isAuth === true) return next()
                else return next({ name:  WelcomePageName})
            } catch(e) {
                return next({ name: WelcomePageName })
            }

        }

        return next()
    }
}

export default middleware