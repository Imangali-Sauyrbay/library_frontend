<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import AppLoader from '@/components/AppLoader.vue'

const ParralaxComponent = defineAsyncComponent({
    loader: async () => import('@/components/welcome-page/parallax/ParallaxComponent.vue'),
    loadingComponent: AppLoader
})

</script>

<template>
    <ParralaxComponent></ParralaxComponent>
</template>

<style scoped lang="scss">
</style>