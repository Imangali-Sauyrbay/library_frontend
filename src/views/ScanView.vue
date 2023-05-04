<script setup lang="ts">
import AppLoader from '@/components/AppLoader.vue'
import { useScanStore } from '@/stores/scanViewStore'

import { defineAsyncComponent, ref } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'

const GetScanData = defineAsyncComponent({
    loader: () => import('@/components/scanners/GetScanData.vue'),
    loadingComponent: AppLoader
})

const showCamera = ref(true)

const { hasFrom, getFrom, setData, setFrom } = useScanStore()
const router = useRouter()

const dataReceived = (data: string) => {
    setData(data)
    if(hasFrom()) {
        try {
            router.push({name: `${getFrom()}` })
        } catch {
            router.push({name: 'home'})
        }
    } else {
        alert(data)
    }
}

onBeforeRouteLeave(() => {
    setFrom(null)
})

const tryAgain = () => {
    alert('tryAgain')
}
</script>

<template>
    <GetScanData 
    :showCamera="showCamera"
    :tryAgainCount="3"
    @data="dataReceived"
    @tryAgain="tryAgain"/>
</template>