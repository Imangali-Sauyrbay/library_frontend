<script setup lang="ts">
import AppLoader from '@/components/AppLoader.vue'
import { useAddBookStore } from '@/stores/addBook';
import { defineAsyncComponent, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useScanStore } from '@/stores/scanViewStore'

const { form } = useAddBookStore()
const { hasData, getData, setFrom } = useScanStore()

const AddBookForm = defineAsyncComponent({
    loader: () => import('@/components/library/AddBookForm.vue'),
    loadingComponent: AppLoader
})

const router = useRouter()
const route = useRoute()

onMounted(() => {
    if(!hasData()) {
        setFrom(route.name as string)
        router.push({name: 'scan'})
    } else {
        form.identifier = getData() || ''
    }
})
</script>

<template>
    <AddBookForm />
</template>

<style scoped>

</style>