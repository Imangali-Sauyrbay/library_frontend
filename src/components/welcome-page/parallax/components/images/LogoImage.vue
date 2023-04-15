<template>
    <div class="logo">
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
@import "@/main.scss";

.logo {
    background-image: url(@/assets/welcome-parallax/parts/logo.png);
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