<script lang="ts" setup>
import { ref } from 'vue'
import { images } from '@/components/welcome-page/parallax/utils/parallaxImages'

const buildingUrl = new URL('@/assets/welcome-parallax/ukgu_building.png', import.meta.url).href

const url = ref(images.has(buildingUrl) ? images.get(buildingUrl) : buildingUrl);
</script>

<template>
    <div class="building" :style="{
        backgroundImage: `url(${url})`
    }">
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
@import "@/main.scss";

.building {
    bottom: -30%;
    left: -50%;
    width: 200%;
    height: 115%;

    @include breakpoint('xxxs') {
        height: 220px;
        bottom: -50px;
    }

    @include breakpoint('xxs') {
        height: 320px;
        bottom: -100px;
    }

    @include breakpoint('xs') {
        height: 370px;
        bottom: -120px;
    }

    @include breakpoint('sm') {
        height: 500px;
    }

    @include breakpoint('md') {
        height: 590px;
        bottom: -150px;
    }

    @include breakpoint('lg') {
        height: 700px;
        bottom: -150px;

    }

    @include breakpoint('xl') {
        height: 770px;
        bottom: -200px;
    }


    @include breakpoint('xxl') {
        height: 110%;
        bottom: -200px;
    }
}
</style>