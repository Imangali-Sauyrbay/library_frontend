import { shallowRef } from 'vue'
import { random } from '@/utils/Random'
import { getUniquePos } from './helpers'
import type { Occupied, IParallaxCloud } from './types'
import SmallCloud from './../components/images/SmallCloud.vue'
import { linearMapping } from '@/utils/Mapping'
import { easeInOutControlPoints, bezier } from '@/utils/Bezier'

interface IGetCloudProps {
    count?: number
    minX?: number
    maxX?: number
    minY?: number
    maxY?: number
    minDepth?: number
    depthStep?: number
    hPercent?: number
    wPercent?: number
    typeVariations?: number
    farDuration?: number
    closeDuration?: number
}

const start = -100
const end = 200
const {p1, p2} = easeInOutControlPoints(start, end)

const getClouds = (props: IGetCloudProps = {}) => {
    const {
        count=~~(2 / 0.2),
        minX=-40,
        maxX=140,
        minY=-5,
        maxY=60,
        minDepth=0.2,
        depthStep=0.02,
        hPercent=5,
        wPercent=10,
        typeVariations=3,
        farDuration=420,
        closeDuration=240
    } = props

    const cloudPositions: Occupied[] = []
    const clouds: IParallaxCloud[] = []

    for (let i = 0; i < count; i++) {
        const position: Occupied = getUniquePos({
            minX, maxX, minY, maxY, hPercent, wPercent,
            occupied: cloudPositions
        })

        cloudPositions.push(position)

        const depth = +(minDepth + (depthStep * (i + 1))).toFixed(2)
        const maxDepth = +(minDepth + (depthStep * count)).toFixed(3)

        const duration = linearMapping(depth, minDepth, maxDepth, farDuration, closeDuration)

        const startTime = -(((position.left - start) / (end - start)) * (duration * 1000))

        clouds.push({
            depth,
            classes: ['cloud-' + random(1, typeVariations + 1)],
            style: {
                top: position.top,
                left: position.left,
            },
            component: shallowRef(SmallCloud),
            duration,
            startTime,
        })
    }
    return clouds
}

const animateClouds = (clouds: IParallaxCloud[], timestamp: number) => {
    clouds.forEach((cloud) => {
        if(!cloud.style) return
        if(!cloud.startTime) {
            cloud.startTime = timestamp
        }

        const duration = (cloud.duration || 20)
        const startTime = cloud.startTime
        const elapsed = (timestamp - startTime) / 1000
        const progress = elapsed / duration

        const position = bezier({
            t: progress,
            startingPoint: start,
            p1,
            p2,
            endingPoint: end,
        })

        if (elapsed > duration) {
            cloud.startTime = timestamp
        }
        
        cloud.style.left = position
    })
}

const animationWithDeltaTime = (
    cb: (
        delta: number,
        clouds: IParallaxCloud[],
        timestamp?: number
    ) => void,
    clouds: IParallaxCloud[],
    ) =>{

    let lastTimestamp: number = Date.now()

    const handler = (timestamp: number) => {
        const delta = (timestamp - lastTimestamp) / 1000
        lastTimestamp = timestamp

        cb(delta, clouds, timestamp)
    }

    return handler
}

export {
    getClouds,
    animateClouds,
    animationWithDeltaTime
}