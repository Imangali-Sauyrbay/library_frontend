<script setup lang="ts">
import AppCard from '@/components/app-card/AppCard.vue'
import AppCardWrapper from '@/components/app-card/AppCardWrapper.vue'
import { computed, defineAsyncComponent, ref } from 'vue'
import { ElContainer, ElLoading, ElButton } from 'element-plus'
import type { Exception } from '@zxing/library'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'
import AppLoader from '@/components/AppLoader.vue'
import { isHTTPS } from '@/utils/CommonUtils'

const StreamScanner = defineAsyncComponent({
    loader: () => import('@/components/scanners/StreamScanner.vue'),
    loadingComponent: AppLoader
})

const ImageScanner = defineAsyncComponent({
    loader: () => import('@/components/scanners/ImageScanner.vue'),
    loadingComponent: AppLoader
})

const props = defineProps<{
    showCamera: boolean,
    tryAgainCount: number
}>()

const emit = defineEmits<{
    (event: 'error', error: Exception): void,
    (event: 'tryAgain'): void,
    (event: 'data', data: string): void,
}>()

const showCam = ref(props.showCamera)
const isApiSupport = ref(isHTTPS())
const isPermissionGranted = ref(true)
const isCameraSupport = computed(() => isApiSupport.value && isPermissionGranted.value)
const isLoaded = ref(!isCameraSupport.value)
const imageLoaded = ref(false)

let loading: LoadingInstance
let errorCount = 0

const handleDecode = (text: string) => {
    emit('data', text)
    loading.close()
}

const handleError = (e: Exception) => {
    if(++errorCount >= props.tryAgainCount) {
        emit('error', e)
    } else {
        imageLoaded.value = false
        emit('tryAgain')
    }

    loading.close()
}

const handleImageDecodeStart = () => {
    imageLoaded.value = true
    loading = ElLoading.service({
        background: 'rgba(0,0,0,.5)',
        lock: true,
        fullscreen: true,
    })
}

const grantPermissionHandler = () => {
    isPermissionGranted.value = true
}

const denyPermissionHandler = () => {
    isPermissionGranted.value = false
    showCam.value = false
    isLoaded.value = true
}

const apiNotSupportedHandler = () => {
    isApiSupport.value = false
    isLoaded.value = true
}

const onLoaded = () => {
    isLoaded.value = true
}

const toggle = () => {
    if(!isApiSupport.value) return

    imageLoaded.value = false
    isPermissionGranted.value = true
    showCam.value = !showCam.value

    if(showCam.value) {
        isLoaded.value = false
    }
}
</script>

<template>
    <ElContainer class="container" v-loading="!isLoaded">
        <div class="center" v-show="isLoaded">
            <AppCardWrapper :card-width="(imageLoaded || showCam) && isCameraSupport ? '600px' : 'fit-conent'">
                <AppCard :show-logo="false" center>
                    <StreamScanner
                    v-if="showCam && isApiSupport"
                    @decode="handleDecode"
                    @api-not-supported="apiNotSupportedHandler"
                    @loaded="onLoaded"
                    @permission-granted="grantPermissionHandler"
                    @permission-denied="denyPermissionHandler"
                    />

                    <ImageScanner
                        v-if="!isCameraSupport || !showCam"
                        @decode="handleDecode"
                        @error="handleError"
                        @decode-started="handleImageDecodeStart"
                    />
                </AppCard>
            </AppCardWrapper>
        </div>

        <ElButton v-if="isApiSupport" class="toggleInput" type="primary" @click="toggle" circle>Toggle</ElButton>
    </ElContainer>
</template>

<style scoped>
.container {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}
.center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.toggleInput {
    position: absolute;
    bottom: 1%;
    right: 1%;
}
</style>