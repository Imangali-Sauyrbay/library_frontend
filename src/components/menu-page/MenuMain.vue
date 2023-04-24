<script setup lang="ts">
import MenuWrapper from './components/MenuWrapper.vue'
</script>

<template>
    <div class="container">
        <MenuWrapper />
    </div>
</template>

<style scoped>
    .container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: scroll;
    }
</style>