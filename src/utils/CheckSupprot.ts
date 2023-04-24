const isenumerateDevicesSupport = () => 
navigator && navigator.mediaDevices && "enumerateDevices" in navigator.mediaDevices

const doesDeviceHasCamera = (result: (result: boolean) => void) => {
    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        for (let i = 0; i < devices.length; i++) {
            const device = devices[i]
            
            if(device.kind === 'videoinput') {
                result(true)
                return
            }
        }

        result(false)
    }).catch(() => result(false))
}

const checkPermission = (permission: string) => {
    const name = permission as PermissionName
    return navigator.permissions.query({name})
}

export {
    isenumerateDevicesSupport,
    checkPermission,
    doesDeviceHasCamera
}