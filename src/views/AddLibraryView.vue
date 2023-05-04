<script setup lang="ts">
import AppLoader from '@/components/AppLoader.vue'
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { ElMessage, type MessageHandler } from 'element-plus'
import { useI18n } from 'vue-i18n'
import type { NomitnatimResponce } from '@/components/types'

const AddressMap = defineAsyncComponent({
    loader: () => import('@/components/AppGetAddressFromMap.vue'),
    loadingComponent: AppLoader
})

const LibraryForm = defineAsyncComponent({
    loader: () => import('@/components/library/AddLibraryForm.vue'),
    loadingComponent: AppLoader
})

const { t } = useI18n()

const resultAddress = ref<NomitnatimResponce | undefined>()
const showForm = ref(false)

let messageHandler: MessageHandler

const handleNext = (result: NomitnatimResponce | undefined) => {
    if(result) {
        resultAddress.value = result
    }

    if(messageHandler) {
        messageHandler.close()
    }

    showForm.value = true
}

onMounted(() => {
    messageHandler = ElMessage.info({
        duration: 10_000,
        showClose: true,
        message: t('pages.library.mapSelectInfo')
    })
})
</script>

<template>
<Transition name="slide-left">
    <AddressMap v-if="!showForm" @next="handleNext"/>
    <LibraryForm v-else :result="resultAddress"/>
</Transition>
</template>

<style scoped>

</style>