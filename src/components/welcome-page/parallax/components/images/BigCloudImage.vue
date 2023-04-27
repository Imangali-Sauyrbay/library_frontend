<script lang="ts" setup>
import type { IParallaxCloud } from './../../utils/types'
defineProps<{item: IParallaxCloud}>()
</script>

<template>
    <div class="cloud-big" :class="item.classes">
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
@import "@/main.scss";

.cloud-big {
    background-image: url(@/assets/welcome-parallax/parts/cloud_big.png);
    width: 30%;
    height: 30%;
    left: 0;
    top: 60%;
    transform: translate3d(-20%, 0, 0) scale(-3, 3) rotateZ(-50deg) !important;
    filter: brightness(1.25);

    @include breakpoint('xxxs') {
        top: calc(100% - 150px);
        height: 10%;
    }

    @include breakpoint('xxs') {
        top: calc(100% - 200px);
        height: 15%;
    }

    @include breakpoint('xs') {
        top: calc(100% - 200px);
    }

    @include breakpoint('sm') {
        top: calc(100% - 340px);
    }
    
    @include breakpoint('md') {
        height: 20%;
    }

    @include breakpoint('lg') {
        top: calc(100% - 400px);
        height: 25%;
    }

    @include breakpoint('xl') {
        top: calc(100% - 390px);
        height: 35%;
    }


    @include breakpoint('xxl') {
        top: 30%;
        height: 15%;
    }
}

.cloud-big.right {
    left: 100%;
    transform: translate3d(-80%, 0, 0) scale(3) rotateZ(-15deg) !important;
}
</style>