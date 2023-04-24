<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import LoginCardSkeleton from '@/components/app-card/AppCardSkeleton.vue'

const LoginCard = defineAsyncComponent({
    loader: () => import('@/components/auth/LoginCard.vue'),
    loadingComponent: LoginCardSkeleton
})
</script>

<template>
    <LoginCard />
</template>