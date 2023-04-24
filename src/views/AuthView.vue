<script setup lang="ts">
import AuthLayout from '@/components/layouts/AuthLayout.vue'
</script>

<template>
    <AuthLayout>
        <RouterView v-slot="{ Component }">
            <Transition name="fade-in" mode="out-in">
                <component :is="Component"></component>
            </Transition>
        </RouterView>
    </AuthLayout>
</template>

<style scoped>
</style>