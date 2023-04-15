import { random } from '@/utils/Random'
import type { IParallaxImage, Occupied, UniquePosProps } from './types'

const getRandPlace = (maxX: number, maxY: number, minX: number, minY: number):Occupied => ({
    top: random(minY, maxY),
    left: random(minX, maxX)
})


const isCollided = (x1: number, x2: number, length: number): boolean => {
    return Math.abs(x1 - x2) < length
}

const checkForUniquePlace = (item: Occupied, array: Occupied[], itemsWidthPercent: number, itemsHeightPercent: number): boolean => {
    for (let i = 0; i < array.length; i++) {
        const place = array[i];
        
        if(isCollided(place.left, item.left, itemsWidthPercent) &&
        isCollided(place.top, item.top, itemsHeightPercent)) {
            return false
        }
    }
    return true
}

const getUniquePos = (props: UniquePosProps): Occupied => {
    const maxIteration = 30
    const { maxX, maxY, minX, minY, occupied, wPercent, hPercent} = props

    let newItem: Occupied = getRandPlace(maxX, maxY, minX, minY)

    for(let i = 0; i <= maxIteration; i++) {
        if(checkForUniquePlace(newItem, occupied, wPercent, hPercent)) {
            return newItem
        }

        newItem = getRandPlace(maxX, maxY, minX, minY)
    }

    return newItem
}

const isCloud = (image: IParallaxImage): boolean => {
    let result = false
    const regex = /^cloud-\d+/

    image.classes?.forEach(className => {
        if (regex.test(className)) {
            result = true
        }
    })
    
    return result
}

const isPlant = (image: IParallaxImage): boolean => {
    let result = false
    const regex = /^branch-\d+/

    image.classes?.forEach(className => {
        if (regex.test(className)) {
            result = true
        }
    })
    
    return result
}

export {
    isCloud,
    getUniquePos,
    isPlant
}