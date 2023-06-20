import type { AxiosError } from "axios"
import type { Middleware } from "./types"
import authService from '@/services/AuthService'
import { ElMessage } from "element-plus"
import { i18n } from "@/i18n"

const WelcomePageName = 'login'

const middleware: Middleware = {
    hook: 'beforeEach',
    callback: async (to, _, next) => {
        if(to.meta.auth) {
            try {
                const result = await authService.me()

                if(result.status === 200) return next()
                else return next({ name:  WelcomePageName})
            } catch(e) {
                const error = e as AxiosError

                if(error.response?.status === 417) {
                    to.meta['to_fill'] = error.response.data
                    return next()
                }

                if(error.response?.status === 429) {
                    ElMessage({
                        type: "warning",
                        message: i18n.global.t("app.errors.toManyRequests")
                    })
                }

                return next({ name: WelcomePageName })
            }
        }

        return next()
    }
}

export default middleware