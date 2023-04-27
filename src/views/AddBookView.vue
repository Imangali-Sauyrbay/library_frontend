<script setup lang="ts">
import AppLoader from '@/components/AppLoader.vue'
import { useAddBookStore } from '@/stores/addBook';
import { defineAsyncComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router';

const { form } = useAddBookStore()

const AddBookForm = defineAsyncComponent({
    loader: () => import('@/components/library/AddBookForm.vue'),
    loadingComponent: AppLoader
})

const router = useRouter()

onMounted(() => {
    if(!form.identifier) {
        router.push({name: 'qr'})
    }
})
</script>

<template>
    <AddBookForm />
</template>

<style scoped>

</style>