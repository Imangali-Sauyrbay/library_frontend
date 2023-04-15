<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount, reactive } from 'vue'
import raf from 'raf'

import { clamp } from '@/utils/Clamp';
import useMobileDevice from '@/hooks/useMobileDevice';

import getImages from './../utils/parallaxImages'
import { getClouds, animateClouds } from './../utils/clouds'
import { isCloud, isPlant } from './../utils/helpers'
import { getBuildingHeightPercent } from './images/utils';
import { getPlants } from './../utils/plants'

import type { IParallaxCloud } from '../utils/types';

const { isMobile } = useMobileDevice()

const items = reactive<IParallaxCloud[]>(
    getImages(
        getClouds({
            count: isMobile() ? 7 : 15,
            depthStep: isMobile() ? +(0.2 / 7).toFixed(3) : +(0.2 / 15).toFixed(3),
            closeDuration: isMobile() ? 150 : 300,
            farDuration: isMobile() ? 300 : 600,
            maxY: clamp((1 - getBuildingHeightPercent()) * 100, 15, 90) + 10
        }),

        getPlants(.5, .98, 6, .7)
    )
)

const rafId = ref<number>()

const clouds = items.filter(isCloud)

const animate = (timestamp: number) => {
    animateClouds(clouds, timestamp)
    setTimeout(() => {
        rafId.value = raf(animate)
    }, 1000 / 60);
}

onMounted(() => {
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
    :key="item.depth + (item.classes || []).join('-')"
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