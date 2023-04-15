<script setup lang="ts">
defineProps({
    count: {
        type: Number,
        default: 3
    },

    delay: {
        type: Number,
        default: 2
    }
})
</script>

<template>
    <span
        v-for="i in count"
        class="wave"
        :style="{animationDelay: delay + (0.8 * i) + 's'}"
        :key="i"></span>
</template>

<style lang="scss" scoped>
@import '@/main.scss';

.wave {
    position: absolute;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.5);
    transition: all .5s ease-in-out;
    pointer-events: none;
    user-select: none;
    display: none;

    top: calc(50%);
    left: calc(50%);

    transform: translate(-50%, -50%);
}

.closed .wave {
    display: block;
    animation: wave 4s infinite ease-out;
    opacity: 1;
}

.transition-active .wave {
    display: block;
    animation: none;
    opacity: 0;
}

@keyframes wave {
    0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -50%) scale(2);
        opacity: 0;
    }
}

@include breakpoint('lg') {
    .wave {
        width: 76px;
        height: 76px;
        border-width: 2px;
    }
}

@include breakpoint('xxl') { 
    .wave {
        width: calc(5vw + 6px);
        height: calc(5vw + 6px);
    }
}
</style>