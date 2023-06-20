<script lang="ts" setup>
import { ref } from 'vue'
import { images } from '@/components/welcome-page/parallax/utils/parallaxImages'

const logoUrl = new URL('@/assets/welcome-parallax/parts/logo.png', import.meta.url).href

const url = ref(images.has(logoUrl) ? images.get(logoUrl) : logoUrl);
</script>

<template>
    <div class="logo" :style="{
        backgroundImage: `url(${url})`
    }">
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
@import "@/main.scss";

.logo {
    width: 40%;
    height: 15%;
    top: 1%;
    left: 50%;
    transform: translate3d(-50%,0,0) !important;

    @include breakpoint('xxxs') {
        height: 15%;
        top: 7%;
        @include mhBreakpoint(220px) {
            top: 1%;
        }
    }

    @include breakpoint('lg') {
        top: 5px;
    }

    @include breakpoint('xl') {
        top: -15px;
    }

    @include breakpoint('xxl') {
        left: 100%;
        transform: translate3d(-100%, 0, 0);
    }
}
</style>