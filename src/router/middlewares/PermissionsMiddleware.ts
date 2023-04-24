import { ElMessageBox } from "element-plus"
import eventBus from '@/composables/eventBus'
import { i18n } from "@/i18n"
import type { Middleware } from "./types"
import { isenumerateDevicesSupport } from "@/utils/CheckSupprot"
import { isHTTPS } from "@/utils/CommonUtils"

const message = (
    text: string,
    title: string = i18n.global.t('app.permissions.title')
    ) => ElMessageBox.confirm( text, title, {
    draggable: true,
    type: 'warning',
    confirmButtonText: i18n.global.t('app.actions.understood'),
    cancelButtonClass: 'd-none'
})


const notifyAboutPermission = async (permissionsText: string) => {
    const name = 'camera' as PermissionName
    
    try {
        const status = await navigator.permissions.query({ name })

        if (status.state === 'prompt') {
            message(i18n.global.t('app.permissions.text', {
                permission: permissionsText
            }))
        }
    
        if(status.state === 'denied') {
            message(i18n.global.t('app.permissions.textDenied', {
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

        if(!Array.isArray(permissions) || permissions?.length === 0) {
            return next()
        }

        if(permissions.includes('camera') && !isenumerateDevicesSupport()) {
            const reason = isHTTPS() ? 'apiNotSupported' : 'onlyHTTPS'
            message(i18n.global.t('app.permissions.' + reason, {
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