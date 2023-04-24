import { BinaryBitmap, HTMLCanvasElementLuminanceSource, HybridBinarizer, LuminanceSource, RGBLuminanceSource } from "@zxing/library"

type ContextReturn =  {
    w: number
    h: number
    ctx: CanvasRenderingContext2D | null
    canvas: HTMLCanvasElement
}
const getContext = (image: HTMLImageElement, willReadFrequently = false): ContextReturn => {
    const canvas = document.createElement('canvas')
    
    const
    w: number = image.naturalWidth || image.width,
    h: number = image.naturalHeight || image.height

    const
        ratio1 = 680 / w,
        ratio2 = 680 / h,
        ratio = ratio1 < ratio2 ? ratio1 : ratio2;

    const canvasCopy = document.createElement("canvas")
    const copyContext = canvasCopy.getContext("2d")
    const canvasCopy2 = document.createElement("canvas")
    const copyContext2 = canvasCopy2.getContext("2d")

    canvasCopy.width = w
    canvasCopy.height = h
    copyContext?.drawImage(image, 0, 0)
    
    // init
    canvasCopy2.width = w
    canvasCopy2.height = h
    copyContext2?.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasCopy2.width, canvasCopy2.height);
    
    
    const rounds = 1
    const roundRatio = ratio * rounds
    for (let i = 1; i <= rounds; i++) {
    
    
        canvasCopy.width = w * roundRatio / i;
        canvasCopy.height = h * roundRatio / i;
    
        copyContext?.drawImage(canvasCopy2, 0, 0, canvasCopy2.width, canvasCopy2.height, 0, 0, canvasCopy.width, canvasCopy.height);
    
        canvasCopy2.width = w * roundRatio / i;
        canvasCopy2.height = h * roundRatio / i;
        copyContext2?.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasCopy2.width, canvasCopy2.height);
    
    }
    
    canvas.width = w * roundRatio / rounds;
    canvas.height = h * roundRatio / rounds;
    
    const ctx = canvas.getContext('2d', { willReadFrequently })
    ctx?.drawImage(canvasCopy2, 0, 0, canvasCopy2.width, canvasCopy2.height, 0, 0, canvas.width, canvas.height)
    
    return {
        w, h, ctx, canvas
    }
}

const getBinaryBitmap = (image: HTMLImageElement | ContextReturn, inverse = false) => {
    
    let canvas: HTMLCanvasElement

    if(image instanceof HTMLImageElement) {
        canvas = getContext(image).canvas
    } else {
        canvas = image.canvas
    }

    let luminance: LuminanceSource = new HTMLCanvasElementLuminanceSource(canvas)
    
    if (inverse) {
        luminance = luminance.invert()
    }

    const treshold = new HybridBinarizer(luminance)

    return new BinaryBitmap(treshold)
}

export {
    getBinaryBitmap,
    getContext
}