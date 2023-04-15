import type { ShallowRef } from 'vue'

interface IParallaxImage {
    depth: number
    component: ShallowRef
    classes?: string[]
}

interface IPositionStyle {
    top: number
    left: number
}

interface IParallaxCloud extends IParallaxImage {
    style?: IPositionStyle
    duration?: number
    startTime?: number
}

interface IParallaxPlant extends IParallaxImage {
    style: IPositionStyle
}

type Occupied = {
    top: number,
    left: number,
}

type UniquePosProps = {
    wPercent: number,
    hPercent: number,
    maxX: number,
    maxY: number,
    minX: number,
    minY: number,
    occupied: Occupied[]
}

interface IParallaxOptions {
    precision?: number
    relativeInput?: boolean
    clipRelativeInput?: boolean
    hoverOnly?: boolean
    inputElement?: string | null
    pointerEvents?: boolean
    calibrateX?: boolean
    calibrateY?: boolean
    calibrationThreshold?: number
    calibrationDelay?: number
    supportDelay?: number
    invertX?: boolean
    invertY?: boolean
    limitX?: number | false
    limitY?: number | false
    scalarX?: number
    scalarY?: number
    frictionX?: number
    frictionY?: number
    originX?: number
    originY?: number
    selector?: string | null
    onReady?: () => void
    onDeviceOrientationNotSupported?: () => void
    onDeviceMotionNotSupported?: () => void
}

export type {
    UniquePosProps,
    Occupied,
    IParallaxCloud,
    IPositionStyle,
    IParallaxPlant,
    IParallaxImage,
    IParallaxOptions
}