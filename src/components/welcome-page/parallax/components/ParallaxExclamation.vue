<template>
    <h2 class="excl">!</h2>
</template>

<style lang="sass" scoped>
@import '@/main.scss'

.excl
    display: none
    color: white
    opacity: 1
    transition: all 1s ease-in-out
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)

.closed .excl
    pointer-events: none
    display: block

.transition-active .excl
    opacity: 0
    display: block

@include breakpoint('lg')
    .excl
        font-size: 48px

@include breakpoint('xxl')
    .excl
        font-size: 3vw
</style>