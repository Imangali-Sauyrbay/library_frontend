<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue"
import { BrowserMultiFormatReader, type Result } from "@zxing/library"
import { isenumerateDevicesSupport, checkPermission, doesDeviceHasCamera } from "@/utils/CheckSupprot"
import { onBeforeRouteLeave } from "vue-router"

const isLoading = ref(true)
const scanner = ref<HTMLVideoElement>()
const isMediaSupported = ref(isenumerateDevicesSupport())
const codeReader = new BrowserMultiFormatReader()

type PermissionState = "denied" | "granted" | "prompt"
const cameraPermission = ref<PermissionState>('prompt')

const removePermissionListeners: (() => void)[] = []

const reactivePermissions = async () => {
    const result = await checkPermission('camera')

    const handle = (e: Event) => {
        const perm = e?.target as PermissionStatus
        cameraPermission.value = (perm?.state  || 'denied') as PermissionState
    }

    result.addEventListener('change', handle)

    removePermissionListeners.push(() => 
    result.removeEventListener('change', handle))
}

const emit = defineEmits<{
    (event: 'loaded'): void,
    (event: 'apiNotSupported'): void,
    (event: 'permissionDenied'): void,
    (event: 'permissionGranted'): void,
    (event: 'decode', text: string): void,
    (event: 'result', result: Result): void,
}>()

let started = false

const start = () => {
    if(!scanner.value) return

    navigator.mediaDevices.getUserMedia({video: {
        facingMode: 'environment',
        width: {min: 480, ideal: 720, max: 1280},
        height: {min: 300, ideal: 480, max: 720}
    }})
    .then((stream) => {
        codeReader.decodeFromStream(stream, scanner.value!, (result) => {
            if (result) {
                emit("decode", result.getText())
                emit("result", result)
            }
        })
        .then(() => {
            started = true
            cameraPermission.value = 'granted'
        })
    })
    .catch(() => {
        cameraPermission.value = 'denied'
    })
}

const updatePermissions = () => {
    if(cameraPermission.value === 'denied') {
        emit('permissionDenied')
        codeReader.reset()
        started = false
        isLoading.value = true
    }

    if(cameraPermission.value === "granted") {
        emit('permissionGranted')
        isLoading.value = false
        if(!started) {
            start()
        }
    }

    if(cameraPermission.value === 'prompt') {
        start()
    }
}

watch(cameraPermission, updatePermissions)

onMounted(() => {
    if (!isMediaSupported.value) {
      return emit('apiNotSupported')
    }

    doesDeviceHasCamera((value) => {
        if(!value) {
            isMediaSupported.value = false
            return emit('apiNotSupported')
        }
    })

    reactivePermissions()
    updatePermissions()

    const loaded = () => {
      isLoading.value = false
      emit("loaded")
    }
    scanner.value?.addEventListener('canplay', loaded)
})

const reset = () => {
    codeReader.reset()
    removePermissionListeners.forEach(cb => cb())
}

onBeforeUnmount(reset)
onBeforeRouteLeave(reset)
</script>

<template>
    <div class="scanner-container" v-show="!isLoading">
        <video poster="data:image/gif,AAAA" ref="scanner"></video>
        <div class="overlay-element"></div>
        <div class="laser"></div>
    </div>
</template>

<style scoped>
video {
    max-width: 100%;
    min-height: 100%;
}
.scanner-containe, video, .overlay-element {
    width: 100%;
    height: 100%;
}

.scanner-container {
    background-color: transparent;
    position: relative;
    overflow: hidden;
}

.overlay-element {
    position: absolute;
    top: 0;
    left: 0;
    height: 98%;
    background: rgba(30, 30, 30, 0.5);
    clip-path: polygon(0% 0%, 0% 100%, 20% 100%, 20% 25%, 80% 25%, 80% 75%, 20% 75%, 20% 100%, 100% 100%, 100% 0%);
}

.laser {
    width: 60%;
    background-color: tomato;
    height: 1px;
    position: absolute;
    top: 40%;
    left: 20%;
    z-index: 2;
    box-shadow: 0 0 4px red;
    animation: scanning 2s infinite;
}

@keyframes scanning {
    50% {
        -webkit-transform: translateY(75px);
        transform: translateY(75px);
    }
}
</style>