<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import RegisterCardSkeleton from '@/components/app-card/AppCardSkeleton.vue'

const RegisterCard = defineAsyncComponent({
    loader: () => import('@/components/auth/RegisterCard.vue'),
    loadingComponent: RegisterCardSkeleton
})
</script>

<template>
    <RegisterCard />
</template>