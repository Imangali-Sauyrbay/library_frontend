<script setup lang="ts">
import GuestLayout from '@/components/layouts/GuestLayout.vue'
</script>

<template>
    <RouterView v-slot="{ Component }">
        <GuestLayout>
            <Transition name="zoom-in">
                <component :is="Component"></component>
            </Transition>
        </GuestLayout>
    </RouterView>
</template>

<style>
.zoom-in-enter-active,
.zoom-in-leave-active {
    transition: all .5s ease-in-out;
}

.zoom-in-enter-from,
.zoom-in-leave-to {
    opacity: 0;
    transform: scale(0);
}
</style>
