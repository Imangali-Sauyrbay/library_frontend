<template>
    <div class="statue">
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
@import "@/main.scss";

.statue {
    background-image: url(@/assets/welcome-parallax/parts/auzov.png);
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