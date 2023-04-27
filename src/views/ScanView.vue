<script setup lang="ts">
import AppLoader from '@/components/AppLoader.vue';
import { useAddBookStore } from '@/stores/addBook';
import { defineAsyncComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

const GetScanData = defineAsyncComponent({
    loader: () => import('@/components/scanners/GetScanData.vue'),
    loadingComponent: AppLoader
})

const showCamera = ref(true)

const { form } = useAddBookStore()
const router = useRouter()


const dataReceived = (data: string) => {
    form.identifier = data
    router.replace({name: 'add-book'})
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