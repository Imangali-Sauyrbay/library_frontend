<script setup lang="ts">
import { ref, watch } from 'vue'
import raf from 'raf'
import { clamp } from '@/utils/Clamp'
import { ElProgress } from 'element-plus'

const progressTimerStart = ref(0)
const progress = ref(0)

const props = defineProps<{progress: number, duration: number}>()
const emit = defineEmits<{
    (event: 'progressStarted'): void,
    (event: 'progressEnded'): void
}>()

const getColorByPercentage = (percentage: number) => {
    if (percentage < 30) {
        return '#909399'
    }
    if (percentage < 70) {
        return '#e6a23c'
    }

    return '#67c23a'
}

const startTimer = () => {
    if (progress.value <= 0)
        return emit('progressEnded')

    const curr = Date.now()
    const prog = (1 - ((curr - progressTimerStart.value) / props.duration)) * 100
    progress.value = clamp(prog, 0, 100)
    setTimeout(() => raf(startTimer), 1000 / 30)
}

watch(() => props.progress, () => {
    if (props.progress === 100) {
        progress.value = 100
        progressTimerStart.value = Date.now()
        startTimer()
        emit('progressStarted')
    }
})
</script>

<template>
    <ElProgress
    class="progressbar"
    :percentage="progress"
    :color="getColorByPercentage"
    :text-inside="true"
    :style="{display: progress > 0 ? 'block' : 'none'}">
        <span></span>
    </ElProgress>
</template>

<style scoped>
.progressbar {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 65%;
}

.closed .progressbar {
    display: none
}
</style>