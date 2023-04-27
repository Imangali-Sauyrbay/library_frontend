const isHTTPS = () => window.location.protocol.startsWith('https') ||
    window.location.hostname === 'localhost'

const openMapApp = (lat: number, lng: number) => {
    /* @ts-ignore*/
    const ua = navigator.userAgent || navigator.vendor || window.opera

    /* @ts-ignore*/
    if ((/iPad|iPhone|iPod/).test(ua) && !window.MSStream) {
        return window.open(`maps://maps.apple.com/?q=${lat},${lng}`, '_blank')
    } else if ((/android/i).test(ua)) {
        return window.open(`geo:${lat},${lng}`, '_blank')
    } else {
        return window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank')
    }
}
export {
    isHTTPS,
    openMapApp
}