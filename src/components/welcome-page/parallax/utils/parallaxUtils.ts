type StringObject = {
    [key: string]: string
}

const propertyCache: StringObject = {}

const vendors =  [null, ['-webkit-','webkit'], ['-moz-','Moz'], ['-o-','O'], ['-ms-','ms']]

const data = (element: HTMLElement, name: string): string => {
    return element.getAttribute('data-' + name) || ''
}

const dataBool = (
    element: HTMLElement,
    name: string,
    defaultValue:
    boolean = false
): boolean => {
    const value = data(element, name)
    let result: boolean | null = null

    if(value === 'true') {
        result = true
    }

    if(value === 'false') {
        result = false
    }

    return typeof result === 'boolean' ? result : defaultValue
}

const dataFloat = (
    element: HTMLElement,
    name: string,
    defaultValue: number = 0
): number => {
    const value = data(element, name)
    return (!isNaN(parseFloat(value)) && isFinite(parseFloat(value)))
    ? parseFloat(value)
        : defaultValue
}

const camelCase = (value: string): string => {
    return value.replace(/-+(.)?/g, (_, character) => {
      return character ? character.toUpperCase() : ''
    })
}

const transformSupport = (value: string) => {
    const element = document.createElement('div');
    let propertySupport = false,
        propertyValue = null,
        featureSupport = false,
        cssProperty: string = '',
        jsProperty: string = ''
        
    for (let i = 0, l = vendors.length; i < l; i++) {
        const vendor = vendors[i]
        if (vendor !== null) {
            cssProperty = vendor[0] + 'transform'
            jsProperty = vendor[1] + 'Transform'
        } else {
            cssProperty = 'transform'
            jsProperty = 'transform'
        }
        if (element.style[jsProperty as keyof typeof element.style] !== undefined) {
            propertySupport = true
            break
        }
    }

    switch(value) {
        case '2D':
            featureSupport = propertySupport
            break
        case '3D':
            if (propertySupport) {
                const body = document.body || document.createElement('body'),
                documentElement = document.documentElement,
                documentOverflow = documentElement.style.overflow
                let isCreatedBody = false

                if (!document.body) {
                    isCreatedBody = true
                    documentElement.style.overflow = 'hidden'
                    documentElement.appendChild(body)
                    body.style.overflow = 'hidden'
                    body.style.background = ''
                }

                body.appendChild(element)
                element.style.setProperty(jsProperty, 'translate3d(1px,1px,1px)') 
                propertyValue = window.getComputedStyle(element).getPropertyValue(cssProperty)
                featureSupport = propertyValue !== undefined && propertyValue.length > 0 && propertyValue !== 'none'
                documentElement.style.overflow = documentOverflow
                body.removeChild(element)

                if ( isCreatedBody ) {
                    body.removeAttribute('style')
                    body.parentNode?.removeChild(body)
                }
            }

            break
    }

    return featureSupport
}

const css = (element: HTMLElement, property: string, value: string) => {
    let jsProperty = propertyCache[property]
    if (!jsProperty) {
      for (let i = 0, l = vendors.length; i < l; i++) {
        const vendor = vendors[i]

        if (vendor !== null) {
          jsProperty = camelCase(vendor[1] + '-' + property)
        } else {
          jsProperty = property
        }

        if (element.style[jsProperty as keyof typeof element.style] !== undefined) {
          propertyCache[property] = jsProperty
          break
        }
      }
    }

    element.style.setProperty(jsProperty, value)
  }

const accelerate = (element: HTMLElement): void => {
    css(element, 'transform', 'translate3d(0,0,0) rotate(0.0001deg)')
    css(element, 'transform-style', 'preserve-3d')
    css(element, 'backface-visibility', 'hidden')
}

export {
    accelerate,
    camelCase,
    css,
    transformSupport,
    data,
    dataBool,
    dataFloat
}

interface ParallaxUtils {
    accelerate: typeof accelerate,
    camelCase: typeof camelCase,
    css: typeof css,
    transformSupport: typeof transformSupport,
    data: typeof data,
    dataBool: typeof dataBool,
    dataFloat: typeof dataFloat
}

export type {
    ParallaxUtils
}

