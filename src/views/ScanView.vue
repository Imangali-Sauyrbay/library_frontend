<script setup lang="ts">
import AppLoader from '@/components/AppLoader.vue';
import { defineAsyncComponent, ref } from 'vue';

const GetScanData = defineAsyncComponent({
    loader: () => import('@/components/scanners/GetScanData.vue'),
    loadingComponent: AppLoader
})

const showCamera = ref(true)

const dataReceived = (data: string) => {
    alert(data)
}

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