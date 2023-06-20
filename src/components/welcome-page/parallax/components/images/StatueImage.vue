<script lang="ts" setup>
import { ref } from 'vue'
import { images } from '@/components/welcome-page/parallax/utils/parallaxImages'

const statueUrl = new URL('@/assets/welcome-parallax/parts/auzov.png', import.meta.url).href

const url = ref(images.has(statueUrl) ? images.get(statueUrl) : statueUrl);
</script>

<template>
    <div class="statue" :style="{
        backgroundImage: `url(${url})`
    }">
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
@import "@/main.scss";

.statue {
    bottom: -50px;
    left: 50%;
    transform: translate3d(-50%, 0, 0) !important;
    width: 60%;
    height: 60%;

    @include breakpoint('xxxs') {
        height: 160px;
    }

    @include breakpoint('xxs') {
        height: 175px;
    }

    @include breakpoint('xs') {
        height: 190px;
    }

    @include breakpoint('sm') {
        height: 290px;
    }

    @include breakpoint('md') {
        height: 320px;
    }

    @include breakpoint('lg') {
        height: 390px;
    }

    @include breakpoint('xl') {
        height: 400px;
    }

    @include breakpoint('xxl') {
        height: 65%;
    }
}
</style>