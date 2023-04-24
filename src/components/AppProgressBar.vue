<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { randomFloat } from '@/utils/Random'
import eventBus from '@/composables/eventBus'

const defaultDuration = 8000 
const defaultInterval = 1000 
const variation = 0.5 
const startingPoint = 0 
const endingPoint = 90 

const isLoading = ref(true)
const isError = ref(false)
const isVisible = ref<boolean>(false)
const progress = ref(startingPoint)
const timeoutId = ref<number | undefined>(undefined)

const loop = () => {
    if (timeoutId.value) {
        clearTimeout(timeoutId.value)
    }

    if (progress.value >= endingPoint) {
        return
    }

    const size = (endingPoint - startingPoint) / (defaultDuration / defaultInterval)
    const p = Math.round(progress.value + randomFloat(size * (1 - variation), size * (1 + variation)))
    progress.value = Math.min(p, endingPoint)

    timeoutId.value = window.setTimeout(loop,
        randomFloat(defaultInterval * (1 - variation), defaultInterval * (1 + variation))
    )
}

const start = () => {
    isError.value = false
    isLoading.value = true
    isVisible.value = true
    progress.value = startingPoint
    loop()
}

const stop = () => {
    isLoading.value = false
    progress.value = 100
    clearTimeout(timeoutId.value)

    setTimeout(() => {
        if (!isLoading.value) {
            isVisible.value = false
        }
    }, 200)
}

const error = () => {
    isError.value = true
    setTimeout(stop, 300)
}

onMounted(() => {
    eventBus.on('asyncComponentLoading', start)
    eventBus.on('asyncComponentLoaded', stop)
    eventBus.on('asyncComponentError', error)
})

onBeforeMount(() => {
    eventBus.off('asyncComponentLoading', start)
    eventBus.off('asyncComponentLoaded', stop)
    eventBus.off('asyncComponentError', error)
})
</script>

<template>
    <div :class="{'loading-container': true, loading: isLoading, error: isError, visible: isVisible}">
        <div class="loader" :style="{ minWidth: progress + '%' }">
            <div class="light"></div>
        </div>
        <div class="glow"></div>
    </div>
</template>

<style scoped>
.loading-container {
    font-size: 0;
    position: fixed;
    top: 0;
    left: 0;
    height: 5px;
    width: 100%;
    opacity: 0;
    display: none;
    z-index: 9999;
    transition: opacity .2s;
}

.loading-container.visible {
    display: block;
}
.loading-container.loading {
    opacity: 1;
}

.loader {
    background: #23d6d6;
    display: inline-block;
    height: 100%;
    width: 0%;
    overflow: hidden;
    border-radius: 0 0 5px 0;
    transition: all .2s ease-out;
}

.loader > .light {
    float: right;
    height: 100%;
    width: 20%;
    background-image: linear-gradient(to right, #23d6d6, #29ffff, #23d6d6);
    animation: loading-animation 2s ease-in infinite;
}

.glow {
    display: inline-block;
    height: 100%;
    width: 30px;
    margin-left: -30px;
    border-radius: 0 0 5px 0;
    box-shadow: 0 0 10px #23d6d6;
}

.error .loader {
    background: #d62323;
}

.error .loader > .light {
    background-image: linear-gradient(to right, #d62323, #ff2929, #d62323);
}

.error .glow {
    box-shadow: 0 0 10px #d62323;
}

@keyframes loading-animation {
    0% {
        margin-right: 100%;
    }
    50% {
        margin-right: 100%;
    }
    100% {
        margin-right: -10%;
    }
}
</style>