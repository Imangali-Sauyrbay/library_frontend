<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { VNodeRef } from 'vue'
import type { ParallaxType } from './../Parallax'
import useMobileDevice from '@/hooks/useMobileDevice'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import debounce from '@/utils/Debounce'
import { isHTTPS } from '@/utils/CommonUtils'

const { ifMobile } = useMobileDevice()
const { t } = useI18n()

const scene = ref<VNodeRef | undefined>(undefined)
const sceneW = ref(window.innerWidth + 'px')
const sceneH = ref(window.innerHeight + 'px')
const parallax = ref<ParallaxType | null>(null)

const warn = (translationKey: string) => () => {
    ElMessage({
        type: 'warning',
        message: t(translationKey),
        duration: 10000,
        showClose: true
    })
}

const handleResize = debounce(() => {
    sceneW.value = window.innerWidth + 'px'
    sceneH.value = window.innerHeight + 'px'
}, 400)

window.addEventListener('resize', handleResize)

const startParralax = async () => {
    try {
        const { Parallax } = await import('./../Parallax')
        
        const isSecureConnection = isHTTPS()
        
        const orientMsg = isSecureConnection
        ? 'browserNotSupportOrientation'
        : 'protocolNotSupportOrientation'

        const motionMsg = isSecureConnection
        ? 'browserNotSupportMotion'
        : 'protocolNotSupportMotion'

        parallax.value = new Parallax(scene.value, {
            onDeviceOrientationNotSupported: warn('pages.welcome.' + orientMsg),
            onDeviceMotionNotSupported: warn('pages.welcome.' + motionMsg),
            pointerEvents: true
        })

        ifMobile(parallax.value)
            ?.invert(true, true)
            .scalar(20)
            .limit(200, 80)
            .setCalibrationThreshold(60)
            .friction(0.06, 0.1)
            .calibrate(false, true)

        window.removeEventListener('resize', handleResize)
    } catch (error) {
        ElMessage({
            type: 'error',
            message: t('app.loading.error', ['Parallax', t('app.loading.retrySeconds', 5)]),
            duration: 7000,
            grouping: true
        })

        setTimeout(startParralax, 5000)
    }
}

onMounted(startParralax)
onBeforeUnmount(() => {
    parallax.value?.destroy()
    window.removeEventListener('resize', handleResize)
})
</script>

<template>
    <div ref="scene" class="scene" :style="{
        width: sceneW,
        height: sceneH,
    }">
        <slot></slot>
    </div>
</template>

<style scoped>
.scene {
    overflow: visible;
    display: block;
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    min-height: 460px;
    position: relative;
    overflow: hidden;
}
</style>