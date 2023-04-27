import { clamp } from "@/utils/Clamp"
import { linearMapping } from "@/utils/Mapping"

const getBuildingHeight = (): number => {
    const width = window.innerWidth

    if(width >= 1400) {
        return window.innerHeight * 1.1 - 200
    }

    if(width >= 1200) {
        return 770 - 200
    }

    if(width >= 992) {
        return 700 - 150
    }

    if(width >= 768) {
        return 590 - 150
    }

    if(width >= 576) {
        return 500 - 120
    }

    if(width >= 480) {
        return 370 - 120
    }

    if(width >= 321) {
        return 320 - 100
    }

    if(width < 321) {
        return 220 - 50
    }

    return 590 - 150
}

const getBuildingHeightPercent = (): number => {
    const h = window.innerHeight
    return clamp(getBuildingHeight() / h, 0, 1)
}

const domRectStub: DOMRect = {
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    toJSON() {
        return {}
    }
}

const toLocalePercent = (x: number, y: number, width: number, height: number): {
    localX: number,
    localY: number
} => {
    if(width === 0) {
        width = 1
    }

    if(height === 0) {
        height = 1
    }

    const localX  = (x / width) * window.innerWidth;
    const localY = (y / height) * window.innerHeight;

    return {localX, localY}
}

const calculatePixelValues = (value: number, width: number): number => {
  return +((value / 100) * width).toFixed(2)
}

const getHeightByDistance = (
    depth: number,
    minHeight: number = 5,
    maxHeight: number = 15,
    minDepth: number = .2,
    maxDepth: number = .4
    ) => {
    return `${linearMapping(depth,
        minDepth,
        maxDepth,
        minHeight,
        maxHeight).toFixed(2)}%`
}

export {
    getBuildingHeightPercent,
    getHeightByDistance,
    toLocalePercent,
    domRectStub,
    calculatePixelValues
}
