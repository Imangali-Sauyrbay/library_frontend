<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
    useWindowSize,
    useDraggable,
    useEventListener,
    useSessionStorage,
    type Position } from '@vueuse/core'
import { clamp } from '@/utils/Clamp'

const props = defineProps({
    center: {
        type: Boolean,
        default: true,
        required: false
    },
    target: HTMLElement
})

const draggable = ref<HTMLElement>()

const { width, height } = useWindowSize()
const sessionPos = useSessionStorage('appDraggablePosition', '0;0')

const onMove = (position: Position) => {
    const w = draggable.value?.scrollWidth
    const h = draggable.value?.scrollHeight
    const offsetX = (w || width.value) / 2
    const offsetY = (h || height.value) / 2

    position.x = clamp(position.x, 0 - offsetX, width.value - offsetX)
    position.y = clamp(position.y, 0 - offsetY, height.value - offsetY)

    sessionPos.value = `${position.x};${position.y}`
}

const onStart = (_: Position, e: PointerEvent) => {
    if (e.button !== 0) {
        return false
    }

    if(props.target && props.target !== e.target) {
        return false
    }
}

const [x, y] = sessionPos.value.split(';').map(parseFloat)

const { style: cardStyle, position: cardPosition } = 
useDraggable(draggable, { onStart, onMove, initialValue: {x, y}})

const onResize = () => {
    const pos: Position = {...cardPosition.value}
    onMove(pos)
    cardPosition.value = pos
}

const shouldCenter = () => props.center && x === 0 && y === 0

const setCardToCenter = () => {
    if(!shouldCenter()) return
    const w = draggable.value?.scrollWidth
    const h = draggable.value?.scrollHeight

    cardPosition.value.x = width.value / 2 - ((w || width.value * .2) / 2)
    cardPosition.value.y = height.value / 2 - ((h || height.value * .4) / 2)
}



onMounted(() => {
    setCardToCenter()
    onResize()
})
useEventListener(window, 'resize', onResize)
</script>

<template>
        <div class="draggable" :style="cardStyle" ref="draggable">
            <slot></slot>
        </div>
</template>

<style scoped lang="sass">
.draggable
    position: absolute
    overflow: visible
</style>