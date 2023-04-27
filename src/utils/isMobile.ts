const mobileRE = /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|samsungbrowser.*mobile|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
const notMobileRE = /CrOS/

const tabletRE = /android|ipad|playbook|silk/i

interface isMobileOptions {
    ua?: string,
    tablet?: boolean,
    featureDetect?: boolean
}

const isMobile = (opts: isMobileOptions = {}) => {
  const {
    ua = typeof navigator !== 'undefined' ? navigator.userAgent : '',
    tablet = false,
    featureDetect = false,
  } = opts

  if (typeof ua !== 'string' || ua.length === 0) return false

  let result =
    (mobileRE.test(ua) && !notMobileRE.test(ua)) ||
    (tablet && tabletRE.test(ua))

  if (
    !result &&
    tablet &&
    featureDetect &&
    navigator &&
    navigator.maxTouchPoints > 1 &&
    ua.indexOf('Macintosh') !== -1 &&
    ua.indexOf('Safari') !== -1
  ) {
    result = true
  }

  return result
}

const ifMobile = <T>(toReturn: T): T | null => {
  return isMobile() ? toReturn : null
}

export {
    isMobile,
    ifMobile,
    type isMobileOptions
}
export default isMobile
