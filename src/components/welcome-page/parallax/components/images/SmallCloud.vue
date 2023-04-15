<script lang="ts" setup>
import { computed, ref } from 'vue'
import { getHeightByDistance, toLocalePercent, domRectStub, calculatePixelValues } from './utils';
import type { IParallaxCloud } from './../../utils/types'
const props = defineProps<{item: IParallaxCloud}>()
const cloud = ref<HTMLDivElement>()

const transform = computed(() => {
    const rect = cloud.value?.getBoundingClientRect() || domRectStub
    const w = rect.width
    const h = rect.height

    const {localX, localY} = toLocalePercent(
        props.item.style?.left || 0,
        props.item.style?.top || 0,
        w,
        h
    )

    return `translate(${calculatePixelValues(localX, w)}px, ${calculatePixelValues(localY, h)}px)`
})

const height = computed(() => getHeightByDistance(props.item.depth))
</script>

<template>
    <div class="cloud-small" ref="cloud" :class="item.classes" :style="{transform, height}">
        <slot></slot>
    </div> 
</template>

<style scoped>
.cloud-small {
    width: 300px;
    height: 15%;
    position: absolute;
    top: 0;
    left: 0;
}

.cloud-1 {
    background-image: url(@/assets/welcome-parallax/parts/cloud_small_1.png);
}

.cloud-2 {
    background-image: url(@/assets/welcome-parallax/parts/cloud_small_2.png);
}

.cloud-3 {
    background-image: url(@/assets/welcome-parallax/parts/cloud_small_3.png);
}
</style>