import type { IParallaxPlant } from './types'
import BranchImage from '../components/images/BranchImage.vue'
import { shallowRef } from 'vue'
import { clamp } from '@/utils/Clamp'
import {
    randomFloat,
    getRandomValueFromRanges,
    getRandomValueByProbability,
    getRandomWithProbability,
    type RandValue,
    type Subrange
} from '@/utils/Random'
import isMobile from '@/utils/isMobile'

const getPlant = (
    depth: number,
    left: number,
    top: number,
    classes: string[]
):IParallaxPlant => {
    return {
        component: shallowRef(BranchImage),
        depth,
        style: {
            left,
            top,
        },
        classes,
    }
}

const getRandomDepth = (
    min: number,
    max: number,
    reserved: number,
    range: number
) => {
    const lower = reserved - range
    const upper = reserved + range

    let depth: number = 0

    do {
       depth = getRandomWithProbability(min, max, min, lower, 2)
    } while (
        depth > lower &&
        depth < upper
    )
        
    return depth
}

const checkIsColided = (
    positions: number[],
    minDistancePX: number,
    value: number
): boolean => {

    for (const position of positions) {
        const distance = Math.abs(position - value)
        if (distance < minDistancePX) {
            return false
        }
    }

    return true
}

const getPosFromRange = (
    min: number,
    max: number,
    percent: number
) => percent * (max - min) + min


const getUniquePositionForPlants = (
    positions: number[],
    minDistancePX: number,
    min: number,
    max: number
): number => {
    const mobile = isMobile()
    const subranges: Subrange[] = [
        {
            range: [min, ~~getPosFromRange(min, max, 0.2)],
            probability: 0.1
        },
        {
            range: [~~getPosFromRange(min, max, 0.2) + 1, ~~getPosFromRange(min, max, 0.7)],
            probability: 0.89
        },
        {
            range: [~~getPosFromRange(min, max, 0.7) + 1, max],
            probability: 0.01
        }
    ]
    
    let rand = 0

    for (let i = 0; i <= 300; i++) {
        if(mobile) {
            rand = getRandomValueFromRanges(subranges)
        } else {
            rand = randomFloat(min, max)
        }

        if(checkIsColided(positions, minDistancePX, rand)) break
    }

    return rand
}

const getPlants = (
    minDepth: number,
    maxDepth: number,
    count: number,
    reserved: number | null,
    reservedRange: number = .1
): IParallaxPlant[] => {
    const plants: IParallaxPlant[] = []
    const h = window.innerHeight * 1.5
    const depthStep = +((maxDepth - minDepth) / count).toFixed(3)

    const variation: RandValue<number>[] = [
        {
            value: 1,
            probability: 0.5
        },
        {
            value: 2,
            probability: 0.4
        },
        {
            value: 3,
            probability: 0.1
        }
    ]

    const mobile = isMobile()
    
    for(let i = 0; i < 2; i++) {
        const left = i * 100
        
        let prev: IParallaxPlant | null = null
        const positions: number[] = []

        for (let j = 0; j < count; j++) {
            const height = getUniquePositionForPlants(positions, h * (mobile ? 0.05 : 0.1), 0, h)
            positions.push(height)

            const currPosInPercent = clamp((1 - (height / h)) * 100, 0, 100)
            const classes = ['branch-' + getRandomValueByProbability(variation)]
            
            classes.push(i > 0 ? 'right' : 'left')

            const depth = reserved ?
            getRandomDepth(minDepth, maxDepth, reserved, reservedRange)
            : randomFloat(minDepth, maxDepth)

            const plant = getPlant(
                +depth.toFixed(3),
                left,
                ~~currPosInPercent,
                classes
            )

            if(prev && prev.classes?.[0] === 'branch-3') {
                plant.depth = clamp(prev.depth + depthStep, minDepth, maxDepth)
            }

            plants.push(plant)
            prev = plant
        }
    }

    return plants
}

export {
    getPlants
}
