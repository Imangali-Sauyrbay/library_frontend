<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const MainMenu = defineAsyncComponent(
    () => import('@/components/menu-page/MenuMain.vue')
)
</script>

<template>
    <MainMenu />
</template>