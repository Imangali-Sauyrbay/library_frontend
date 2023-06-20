<script lang="ts" setup>
import { ref } from 'vue'
import { images } from '@/components/welcome-page/parallax/utils/parallaxImages'

const skyUrl = new URL('@/assets/welcome-parallax/ukgu_sky.jpg', import.meta.url).href

const url = ref(images.has(skyUrl) ? images.get(skyUrl) : skyUrl);
</script>

<template>
    <div class="background" :style="{
        backgroundImage: `url(${url})`
    }">
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
@import "@/main.scss";

.background {
    background-size: cover;
    position: absolute;
    bottom: -10%;
    width: 120%;
    left: -10%;
    top: -10%;
}
</style>