import rqAnFr from "raf"
import { clamp } from "@/utils/Clamp"
import isMobile from "@/utils/isMobile"
import type { IParallaxOptions } from './utils/types'
import {
    accelerate,
    css,
    transformSupport,
    data,
    dataBool,
    dataFloat
} from './utils/parallaxUtils'
import debounce from "@/utils/Debounce"

const MAGIC_NUMBER = 30

class Parallax {
    public precision: number = 1
    public relativeInput: boolean = true
    public clipRelativeInput: boolean = true
    public pointerEvents: boolean = false
    public hoverOnly: boolean = false
    public onReady: () => void = () => {}
    public onDeviceOrientationNotSupported: () => void = () => {}
    public onDeviceMotionNotSupported: () => void = () => {}
    public invertX: boolean = true
    public invertY: boolean = true
    public fpsPerSec = 60;
    
    private selector: string | null = null
    private inputElement:  HTMLElement | null = null
    private calibrateX: boolean = false
    private calibrateY: boolean = false
    private limitX: number | false = false
    private limitY: number | false = false
    private scalarX: number = 10.0
    private scalarY: number = 10.0
    private frictionX: number = 0.1
    private frictionY: number = 0.1
    private originX: number = 0.5
    private originY: number = 0.5
    private calibrationThreshold: number = 100
    private calibrationDelay: number = 500
    private supportDelay: number = 2000
    private element?: HTMLElement | undefined

    private layers: NodeListOf<Element> | HTMLCollection | undefined

    private calibrationTimer: number | null = null
    private detectionTimer: number | null = null
    private calibrationFlag = true
    private enabled = false
    private depthsX: number[] = []
    private depthsY: number[] = []
    private raf: number = 0

    private bounds: DOMRect | undefined
    private elementPositionX = 0
    private elementPositionY = 0
    private elementWidth = 0
    private elementHeight = 0

    private elementCenterX = 0
    private elementCenterY = 0

    private elementRangeX = 0
    private elementRangeY = 0

    private calibrationX = 0
    private calibrationY = 0

    private inputX = 0
    private inputY = 0

    private motionX = 0
    private motionY = 0

    private velocityX = 0
    private velocityY = 0

    private orientationStatus = 0
    private motionStatus = 0

    private windowWidth: number | null = null
    private windowHeight: number | null = null
    private windowCenterX: number | null = null
    private windowCenterY: number | null = null
    private windowRadiusX: number | null = null
    private windowRadiusY: number | null = null
    private portrait = false

    private desktop = !isMobile()
    private motionSupport = !!window.DeviceMotionEvent && !this.desktop
    private orientationSupport = !!window.DeviceOrientationEvent && !this.desktop

    private transform2DSupport: boolean | undefined
    private transform3DSupport: boolean | undefined

    constructor(element: HTMLElement, options?: IParallaxOptions) {

        this.element = element

        this.setOptions(options)

        if(!this.inputElement) {
            this.inputElement = this.element
        }

        this.onMouseMove = this.onMouseMove.bind(this)
        this.onDeviceOrientation = this.onDeviceOrientation.bind(this)
        this.onDeviceMotion = this.onDeviceMotion.bind(this)
        this.onOrientationTimer = this.onOrientationTimer.bind(this)
        this.onMotionTimer = this.onMotionTimer.bind(this)
        this.onCalibrationTimer = this.onCalibrationTimer.bind(this)
        this.onAnimationFrame = this.onAnimationFrame.bind(this)
        this.onWindowResize = debounce(this.onWindowResize.bind(this), 500)
        this.onTouchMove = this.onTouchMove.bind(this)

        this.initialise()
    }

    private setOptions(options: IParallaxOptions = {}): Parallax {
        if (!this.element) return this

        const {
            relativeInput = this.relativeInput,
            clipRelativeInput = this.clipRelativeInput,
            inputElement = this.inputElement,
            hoverOnly = this.hoverOnly,
            calibrationThreshold = this.calibrationThreshold,
            calibrationDelay = this.calibrationDelay,
            supportDelay = this.supportDelay,
            calibrateX = this.calibrateX,
            calibrateY = this.calibrateY,
            invertX = this.invertX,
            invertY = this.invertY,
            limitX = this.limitX,
            limitY = this.limitY,
            scalarX = this.scalarX,
            scalarY = this.scalarY,
            frictionX = this.frictionX,
            frictionY = this.frictionY,
            originX = this.originX,
            originY = this.originY,
            pointerEvents = this.pointerEvents,
            precision = this.precision,
            selector = this.selector,
            onReady = () => {},
            onDeviceOrientationNotSupported = () => {},
            onDeviceMotionNotSupported = () => {},
        } = options || {};

        this.clipRelativeInput = dataBool(this.element, 'clip-relative-input', clipRelativeInput)
        this.relativeInput = dataBool(this.element, 'relative-input', relativeInput)
        this.hoverOnly = dataBool(this.element, 'hover-only', hoverOnly)
        this.calibrationThreshold = dataFloat(this.element, 'calibration-threshold', calibrationThreshold)
        this.calibrationDelay = dataFloat(this.element, 'calibration-delay', calibrationDelay)
        this.supportDelay = dataFloat(this.element, 'support-delay', supportDelay)
        this.calibrateX = dataBool(this.element, 'calibrate-x', calibrateX)
        this.calibrateY = dataBool(this.element, 'calibrate-y', calibrateY)
        this.invertX = dataBool(this.element, 'invert-x', invertX) 
        this.invertY = dataBool(this.element, 'invert-y', invertY)

        this.limitX = typeof limitX === 'number'
        ? dataFloat(this.element, 'limit-x', limitX)
        :   data(this.element, 'limit-x') === 'false' ? false : limitX

        this.limitY = typeof limitY === 'number'
        ? dataFloat(this.element, 'limit-y', limitY)
        :   data(this.element, 'limit-y') === 'false' ? false : limitY

        this.scalarX = dataFloat(this.element, 'scalar-x', scalarX) 
        this.scalarY = dataFloat(this.element, 'scalar-y', scalarY) 
        this.frictionX = dataFloat(this.element, 'friction-x', frictionX)
        this.frictionY = dataFloat(this.element, 'friction-y', frictionY)
        this.originX = dataFloat(this.element, 'origin-x', originX)
        this.originY = dataFloat(this.element, 'origin-y', originY)
        this.pointerEvents = dataBool(this.element, 'pointer-events', pointerEvents)
        this.precision = dataFloat(this.element, 'pointer-events', precision)
        this.onReady = onReady
        this.onDeviceMotionNotSupported = onDeviceMotionNotSupported
        this.onDeviceOrientationNotSupported = onDeviceOrientationNotSupported

        const sel = data(this.element, 'selector')
        const inputElAttr = sel ? sel : selector ?? ''
        if (inputElAttr.length !== 0) {
            this.inputElement = document.querySelector(inputElAttr)
        }
        else if (typeof inputElement === 'string' && inputElement.length !== 0) {
            this.inputElement = document.querySelector(inputElement)
        } else if (inputElement instanceof HTMLElement) {
            this.inputElement = inputElement
        }

        return this
    }

    private initialise(): Parallax {
        if (this.transform2DSupport === undefined) {
            this.transform2DSupport = transformSupport('2D')
            this.transform3DSupport = transformSupport('3D')
        }

        if(this.element) {
            // Configure Context Styles
            if (this.transform3DSupport) {
                accelerate(this.element)
            }

            const style = window.getComputedStyle(this.element)
            if (style.getPropertyValue('position') === 'static') {
                this.element.style.position = 'relative'
            }

            // Pointer events
            if(!this.pointerEvents) {
                this.element.style.pointerEvents = 'none'
            }
        }

        // Setup
        this.updateLayers()
        this.updateDimensions()
        this.enable()
        this.queueCalibration(this.calibrationDelay)

        if(!this.desktop && !this.orientationSupport) this.onDeviceOrientationNotSupported()
        if(!this.desktop && !this.motionSupport) this.onDeviceMotionNotSupported()
        return this
    }

    private doReadyCallback(): Parallax {
        if(this.onReady) {
            this.onReady()
        }

        return this
    }

    private updateLayers(): Parallax {
        if(this.selector) {
            this.layers = this.element?.querySelectorAll(this.selector)
        } else {
            this.layers = this.element?.children
        }

        if(!this.layers?.length) {
            console.warn('ParallaxJS: Your scene does not have any layers.')
        }

        const len = this.layers?.length || 0
        for (let index = 0; index < len; index++) {
            const layer = this.layers?.[index] as HTMLElement

            if (this.transform3DSupport) {
                accelerate(layer)
            }

            layer.style.position = index ? 'absolute' : 'relative'
            layer.style.display = 'block'
            layer.style.left = '0'
            layer.style.top = '0'

            const depth = dataFloat(layer, 'depth', 0)
            this.depthsX.push(dataFloat(layer, 'depth-x', depth))
            this.depthsY.push(dataFloat(layer, 'depth-y', depth))
        }

        return this
    }

    private updateDimensions(): Parallax {
        this.windowWidth = window.innerWidth
        this.windowHeight = window.innerHeight
        this.windowCenterX = this.windowWidth * this.originX
        this.windowCenterY = this.windowHeight * this.originY
        this.windowRadiusX = Math.max(this.windowCenterX, this.windowWidth - this.windowCenterX)
        this.windowRadiusY = Math.max(this.windowCenterY, this.windowHeight - this.windowCenterY)

        if (this.element) {
            this.element.style.width = this.windowWidth + 'px'
            this.element.style.height = this.windowHeight + 'px'
        }

        return this
    }

    private updateBounds(): Parallax {
        this.bounds = this.inputElement?.getBoundingClientRect()
        this.elementPositionX = ~~(this.bounds?.left ?? 0)
        this.elementPositionY = ~~(this.bounds?.top ?? 0)
        this.elementWidth = ~~(this.bounds?.width ?? 1)
        this.elementHeight = ~~(this.bounds?.height ?? 1)
        this.elementCenterX = ~~(this.elementWidth * this.originX)
        this.elementCenterY = ~~(this.elementHeight * this.originY)
        this.elementRangeX = ~~Math.max(this.elementCenterX, this.elementWidth - this.elementCenterX)
        this.elementRangeY = ~~Math.max(this.elementCenterY, this.elementHeight - this.elementCenterY)
        return this
    }

    private queueCalibration(delay: number): Parallax {
        this.calibrationTimer && window.clearTimeout(this.calibrationTimer)
        this.calibrationTimer = window.setTimeout(this.onCalibrationTimer, delay)
        return this
    }

    public enable(): Parallax {
        if (this.enabled) {
            return this
        }

        this.enabled = true

        if (this.orientationSupport) {
            this.portrait = false
            window.addEventListener('deviceorientation', this.onDeviceOrientation)
            this.detectionTimer = window.setTimeout(this.onOrientationTimer, this.supportDelay)
        } else if (this.motionSupport) {
            this.portrait = false
            window.addEventListener('devicemotion', this.onDeviceMotion)
            this.detectionTimer = window.setTimeout(this.onMotionTimer, this.supportDelay)
        } else {
            this.calibrationX = 0
            this.calibrationY = 0
            this.portrait = false
            window.addEventListener('mousemove', this.onMouseMove)
            window.addEventListener('touchmove', this.onTouchMove)
            this.doReadyCallback()
        }

        this.queueCalibration(0)

        window.addEventListener('resize', this.onWindowResize)
        this.raf = rqAnFr(this.onAnimationFrame)
        return this
    }

    public disable(): Parallax {
        if (!this.enabled) {
            return this
        }
        this.enabled = false

        if (this.orientationSupport) {
            window.removeEventListener('deviceorientation', this.onDeviceOrientation)
        } else if (this.motionSupport) {
            window.removeEventListener('devicemotion', this.onDeviceMotion)
        } else {
            window.removeEventListener('mousemove', this.onMouseMove)
            window.addEventListener('touchmove', this.onTouchMove)
        }

        window.removeEventListener('resize', this.onWindowResize)
        rqAnFr.cancel(this.raf)
        return this
    }

    public calibrate(x?: boolean, y?: boolean): Parallax {
        this.calibrateX = x === undefined ? this.calibrateX : x
        this.calibrateY = y === undefined ? this.calibrateY : y
        return this
    }

    public invert(x?: boolean, y?: boolean): Parallax {
        this.invertX = x === undefined ? this.invertX : x
        this.invertY = y === undefined ? this.invertY : y
        return this
    }

    public friction(x?: number, y?: number): Parallax {
        this.frictionX = x === undefined ? this.frictionX : x
        this.frictionY = y === undefined ? this.frictionY : y
        return this
    }

    public scalar(x?: number, y?: number): Parallax {
        this.scalarX = x === undefined ? this.scalarX : x
        this.scalarY = y === undefined ? this.scalarY : y
        return this
    }

    public limit(x?: number | false, y?: number | false): Parallax {
        this.limitX = x === undefined ? this.limitX : x
        this.limitY = y === undefined ? this.limitY : y
        return this
    }

    public origin(x?: number, y?: number): Parallax {
        this.originX = x === undefined ? this.originX : x
        this.originY = y === undefined ? this.originY : y
        return this
    }

    public setInputElement(element: HTMLElement): Parallax {
        this.inputElement = element
        this.updateDimensions()
        return this
    }

    public setCalibrationThreshold(value: number): Parallax {
        this.calibrationThreshold = value
        return this
    }

    public setPosition(element: HTMLElement, x: number, y: number): Parallax {
        const strX = x.toFixed(this.precision) + 'px'
        const strY = y.toFixed(this.precision) + 'px'
        if (this.transform3DSupport) {
            css(element, 'transform', 'translate3d(' + strX + ',' + strY + ',0)')
        } else if (this.transform2DSupport) {
            css(element, 'transform', 'translate(' + strX + ',' + strY + ')')
        } else {
            element.style.left = strX
            element.style.top = strY
        }
        return this
    }

    private onOrientationTimer(): Parallax {
        if (this.orientationSupport && this.orientationStatus === 0) {
            const status = this.enabled
            this.disable()
            this.orientationSupport = false
            if(status) this.enable()
            if(!this.desktop) this.onDeviceOrientationNotSupported()
        } else {
            this.doReadyCallback()
        }
        return this
    }

    private onMotionTimer(): Parallax {
        if (this.motionSupport && this.motionStatus === 0) {
            const status = this.enabled
            this.disable()
            this.motionSupport = false
            if(status) this.enable()
            if(!this.desktop) this.onDeviceMotionNotSupported()
        } else {
            this.doReadyCallback()
        }
        return this
    }

    private onCalibrationTimer(): Parallax {
        this.calibrationFlag = true
        return this
    }

    private onWindowResize(): Parallax {
        this.updateDimensions()
        return this
    }

    private onAnimationFrame(): void {
        this.updateBounds()
        const calibratedInputX = this.inputX - this.calibrationX,
            calibratedInputY = this.inputY - this.calibrationY

        if ((Math.abs(calibratedInputX) > this.calibrationThreshold) || (Math.abs(calibratedInputY) > this.calibrationThreshold)) {
            this.queueCalibration(0)
        }
        
        if (this.portrait) {
            this.motionX = this.calibrateX ? calibratedInputY : this.inputY
            this.motionY = this.calibrateY ? calibratedInputX : this.inputX
        } else {
            this.motionX = this.calibrateX ? calibratedInputX : this.inputX
            this.motionY = this.calibrateY ? calibratedInputY : this.inputY
        }

        this.motionX *= this.elementWidth * (this.scalarX / 100)
        this.motionY *= this.elementHeight * (this.scalarY / 100)

        if(this.limitX) {
            const limit_x = this.limitX
            this.motionX = clamp(this.motionX, -limit_x, limit_x)
        }

        if (this.limitY) {
            const limit_y = this.limitY
            this.motionY = clamp(this.motionY, -limit_y, limit_y)
        }
        
        this.velocityX += (this.motionX - this.velocityX) * this.frictionX
        this.velocityY += (this.motionY - this.velocityY) * this.frictionY
        
        const lenght = this.layers?.length || 0

        for (let index = 0; index < lenght; index++) {
            const layer = this.layers?.[index] as HTMLElement
            
            if(!layer) continue
            
            const
            depthX = this.depthsX[index],
            depthY = this.depthsY[index],
            xOffset = this.velocityX * (depthX * (this.invertX ? -1 : 1)),
            yOffset = this.velocityY * (depthY * (this.invertY ? -1 : 1))
            this.setPosition(layer, xOffset, yOffset)
        }

        setTimeout(() => {
            this.raf = rqAnFr(this.onAnimationFrame)
        }, 1000 / this.fpsPerSec);
    }

    private rotate(beta: number, gamma: number): void{
        // Extract Rotation
        const x = (beta || 0) / MAGIC_NUMBER, //  -90 :: 90 => -3 :: 3
            y = (gamma || 0) / MAGIC_NUMBER // -180 :: 180 => -6 :: 6

        // Detect Orientation Change
        const portrait = (this.windowHeight || 0) > (this.windowWidth || 0)
        
        if (this.portrait !== portrait) {
            this.portrait = portrait
            this.calibrationFlag = true
        }

        if (this.calibrationFlag) {
            this.calibrationFlag = false
            this.calibrationX = x
            this.calibrationY = y
        }

        this.inputX = x
        this.inputY = y
    }

    private onDeviceOrientation(event: DeviceOrientationEvent): void {
        const beta = event.beta
        const gamma = event.gamma

        if (beta !== null && gamma !== null) {
            this.orientationStatus = 1
            this.rotate(
                clamp(beta, -180, 180),
                clamp(gamma, -90, 90)
            )
        }
    }

    private motionAlpha = 0.9; // the smoothing factor
    private prevMotionValues: [number, number, number] = [1, 1, 1]

    private onDeviceMotion(event: DeviceMotionEvent): void {
        let beta: number | null  = null
        let gamma: number | null = null

        if (event.accelerationIncludingGravity !== null) {
            const { x, y, z } = event.accelerationIncludingGravity
            if (x !== null && y !== null && z !== null) {
                // low pass filter
                const [prevX, prevY, prevZ] = this.prevMotionValues
                const xv = this.motionAlpha * x + (1 - this.motionAlpha) * prevX
                const yv = this.motionAlpha * y + (1 - this.motionAlpha) * prevY
                const zv = this.motionAlpha * z + (1 - this.motionAlpha) * prevZ
                this.prevMotionValues = [xv, yv, zv]

                //device's rotation around the x (beta) and z (gamma) axis,
                //measured in radians per second to degrees
                beta = clamp(Math.atan2(yv, zv) * (180 / Math.PI), -180, 180)
                gamma = clamp(-Math.atan2(xv, zv) * (180 / Math.PI), -90, 90)
            }
        }

        if (beta !== null && gamma !== null) {
            this.motionStatus = 1
            this.rotate(beta, gamma)
        }
    }

    private onManualInput(clientX: number, clientY: number) {
        // reset input to center if hoverOnly is set and we're not hovering the element
        if(this.hoverOnly && (
            (clientX < this.elementPositionX || clientX > this.elementPositionX + this.elementWidth) ||
            (clientY < this.elementPositionY || clientY > this.elementPositionY + this.elementHeight)
        ))
        {
            this.inputX = 0
            this.inputY = 0
            return
        }
    
        if (this.relativeInput) {
            // Clip mouse coordinates inside element bounds.
            if (this.clipRelativeInput) {
                clientX = Math.max(clientX, this.elementPositionX)
                clientX = Math.min(clientX, this.elementPositionX + this.elementWidth)
                clientY = Math.max(clientY, this.elementPositionY)
                clientY = Math.min(clientY, this.elementPositionY + this.elementHeight)
            }
            // Calculate input relative to the element.
            if(this.elementRangeX && this.elementRangeY) {
                this.inputX = (clientX - this.elementPositionX - this.elementCenterX) / this.elementRangeX
                this.inputY = (clientY - this.elementPositionY - this.elementCenterY) / this.elementRangeY
            }
            } else {
            // Calculate input relative to the window.
            if(this.windowRadiusX && this.windowRadiusY) {
                this.inputX = (clientX - (this.windowCenterX || 0)) / this.windowRadiusX
                this.inputY = (clientY - (this.windowCenterY || 0)) / this.windowRadiusY
            }
        }
    }

    private onTouchMove(event: TouchEvent): void {
        const clientX = event.touches[0].clientX,
        clientY = event.touches[0].clientY

        this.onManualInput(clientX, clientY)
    }

    private onMouseMove(event: MouseEvent): void {
        const clientX = event.clientX,
        clientY = event.clientY

        this.onManualInput(clientX, clientY)
    }

    public destroy(): void {
        this.disable()

        clearTimeout(this.calibrationTimer || 0)
        clearTimeout(this.detectionTimer || 0)

        this.element?.removeAttribute('style')
        const len = this.layers?.length || 0

        for (let index = 0; index < len; index++) {
            this.layers?.[index]?.removeAttribute('style')
        }

        delete this.element
        delete this.layers
    }
}

export {
    Parallax,
    type Parallax as ParallaxType,
    type IParallaxOptions
}
