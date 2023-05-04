import { ElMessage, type MessageHandler } from "element-plus"
import eventBus from '@/composables/eventBus'
import { i18n } from "@/i18n"
import type { Middleware } from "./types"
import { isenumerateDevicesSupport } from "@/utils/CheckSupprot"
import { isHTTPS } from "@/utils/CommonUtils"

const notifications: MessageHandler[] = []

const clearNotifications = () => {
    while(notifications.length > 0) {
        notifications.pop()?.close()
    }
}

const notify = (
text: string,
) => notifications.push(ElMessage.info({
    duration: 5000,
    message: text,
    showClose: true,
    zIndex: 9999
}))



const notifyAboutPermission = async (permissionsText: string) => {
    const name = 'camera' as PermissionName
    
    try {
        const status = await navigator.permissions.query({ name })

        if (status.state === 'prompt') {
            notify(i18n.global.t('app.permissions.text', {
                permission: permissionsText
            }))
        }
    
        if(status.state === 'denied') {
            notify(i18n.global.t('app.permissions.textDenied', {
                permission: permissionsText
            }))
        }
    }
    catch {
        eventBus.emit('asyncComponentError')
    }
}

const middleware: Middleware = {
    hook: 'beforeEach',
    callback: (to, from, next) => {
        const permissions: string[] | unknown = to?.meta?.permissions

        clearNotifications()

        if(!Array.isArray(permissions) || permissions?.length === 0) {
            return next()
        }

        if(permissions.includes('camera') && !isenumerateDevicesSupport()) {
            const reason = isHTTPS() ? 'apiNotSupported' : 'onlyHTTPS'
            notify(i18n.global.t('app.permissions.' + reason, {
                api: i18n.global.t('app.permissions.camera')
            }))
            return next()
        }

        const permissionsText = permissions
        .map((i) => i18n.global.t('app.permissions.' + i))
        .join(', ')

        notifyAboutPermission(permissionsText)

        return next()
    }
}

export default middleware