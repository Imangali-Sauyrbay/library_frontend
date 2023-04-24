<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount, reactive, watch, type WatchStopHandle } from 'vue'
import raf from 'raf'

import { clamp } from '@/utils/Clamp'
import useMobileDevice from '@/hooks/useMobileDevice'

import getImages from './../utils/parallaxImages'
import { getClouds, animateClouds } from './../utils/clouds'
import { isCloud, isPlant } from './../utils/helpers'
import { getBuildingHeightPercent } from './images/utils'
import { getPlants } from './../utils/plants'

import type { IParallaxCloud } from '../utils/types'

import { useFps } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { linearMapping } from '@/utils/Mapping'

const { isMobile } = useMobileDevice()

const pcCount = 15
const mobileClouds = 7
let plantsCount = 8
let cloudsCount = isMobile() ? mobileClouds : pcCount
let depthStep = +(0.2 / cloudsCount).toFixed(3)

const getAll = () => getImages(
    getClouds({
        count: cloudsCount,
        depthStep: depthStep,
        closeDuration: isMobile() ? 150 : 300,
        farDuration: isMobile() ? 300 : 600,
        maxY: clamp((1 - getBuildingHeightPercent()) * 100, 15, 90) + 10
    }),

    getPlants(.5, .98, plantsCount, .7)
)

const items = reactive<IParallaxCloud[]>(getAll())

const rafId = ref<number>()

let clouds = items.filter(isCloud)

const { t } = useI18n()

const warnLowFps = (clouds: number, plants: number, avgFps: number) => {
    ElMessage({
        type: 'warning',
        message: t('pages.welcome.lowFps', {removedClouds: clouds, removedPlants: plants, avgFps}),
        duration: 5000
    })
}

const fps = useFps()
const fpsValues: number[] = []
const fpsValueCount = 20
const minFps = 30
const maxNumToRemoveForSoftReplace = 2
let canCheckFps = false
let isReachedEnd = false
const key = ref<number>(1)

const unwatchFps: WatchStopHandle = watch(fps, () => {
    if(isReachedEnd) return unwatchFps()

    const avg = fpsValues.reduce((acc, item) => acc + item, 0) / fpsValueCount

    if(avg < minFps && canCheckFps && fpsValues.length >= fpsValueCount) {
        const t = clamp(1 - linearMapping(avg, minFps - 10, minFps, 0, 1), -1, 1)
        const cloudsToRemove = ~~(cloudsCount * t) || 1
        const plantsToRemove = ~~(plantsCount * t) || 1

        cloudsCount = clamp(cloudsCount - cloudsToRemove, 2, pcCount)
        depthStep = +(0.2 / cloudsCount).toFixed(3)
        plantsCount = clamp(plantsCount - plantsToRemove, 2, 8)

        if (cloudsToRemove <= maxNumToRemoveForSoftReplace
        && plantsToRemove <= maxNumToRemoveForSoftReplace) {
            let cloudsCounter = cloudsToRemove
            let plantsCounter = plantsToRemove

            items.splice(0, items.length, ...items.reverse().filter((item) => {
                if (cloudsCounter > 0 && isCloud(item)) {
                    cloudsCounter--
                    return false
                }

                if(plantsCounter > 0 && isPlant(item)) {
                    plantsCounter--
                    return false
                }

                return true
            }).reverse())
        } else {
            items.splice(0, items.length, ...getAll())
        }

        clouds = items.filter(isCloud)
        key.value++

        canCheckFps = false
        fpsValues.splice(0, fpsValues.length)

        isReachedEnd = cloudsCount === 2 && plantsCount === 2
        
        warnLowFps(cloudsToRemove, plantsToRemove, +avg.toFixed(1))
        setTimeout(() => {
            canCheckFps = true
        }, 2000)
    }

    fpsValues.push(fps.value)

    if(fpsValues.length > fpsValueCount) {
        fpsValues.shift()
    }
})

const animate = (timestamp: number) => {
    animateClouds(clouds, timestamp)
    setTimeout(() => {
        rafId.value = raf(animate)
    }, 1000 / 60);
}

onMounted(() => {
    setTimeout(() => {
        canCheckFps = true
    }, 5000)

    rafId.value = raf(animate)
})

onBeforeUnmount(() => {
    raf.cancel(rafId.value || 0)
})
</script>

<template>
    <div
    v-for="(item) in items"
    :style="{
        pointerEvents: isPlant(item) ? 'none' : 'inherit'
    }"
    :key="item.depth + (item.classes || []).join('-') + key"
    :data-depth="item.depth" class="layer">
        <component :is='item.component' :item="item"></component>
    </div>
</template>

<style scoped>
.layer {
    position: absolute;
    width: 100%;
    height: 100%;
}

.layer > div {
    background-position: 50% 100%;
    background-size: auto 101%;
    background-repeat: no-repeat;
    position: absolute;
    transform: translate3d(0,0,0);
    transform-style: preserve-3d;
    backface-visibility: hidden;
}
</style>