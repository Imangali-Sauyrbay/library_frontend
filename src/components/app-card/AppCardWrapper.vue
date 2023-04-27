<script setup lang="ts">
defineProps<{cardWidth?: string}>()
</script>

<template>
    <div class="app-card-wrapper" :style="{'--width': cardWidth ?? '480px'}">
        <slot></slot>
    </div>
</template>

<style lang="scss">
@use "@/main.scss" as *;
.app-card-wrapper {
    width: var(--width);
    max-width: 90vw;
    touch-action: none;

    @include breakpoint('xxxs') {
        max-width: 98vw;
    }
}

.app-card-wrapper * {
    transition: all .3s ease-in-out !important;
}
</style>