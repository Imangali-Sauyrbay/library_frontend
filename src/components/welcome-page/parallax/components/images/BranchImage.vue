<script lang="ts" setup>
import type { IParallaxPlant } from './../../utils/types'
import { randomFloat } from '@/utils/Random'

type prop = {
    item: IParallaxPlant
}

defineProps<prop>()
</script>

<template>
    <div class="branch" :class="item.classes" :style="{
        top: item.style.top + '%',
        animationDelay: randomFloat(0, 2) + 's'
    }">
        <slot></slot>
    </div> 
</template>

<style lang="scss" scoped>
@import '@/main.scss';

.branch {
    width: 100%;
    height: 14%;
    position: absolute;
    top: 0;
}

.branch.right {
    left: 60%;
    transform: scale(2);
    animation: branch-shake-right 6s ease-in-out infinite;
}

.branch.left {
    left: -60%;
    transform: scale(-2, 2);
    animation: branch-shake 5s ease-in-out infinite;
}

@include breakpoint('xxxs') {
    .branch {
        height: 10%;
    }

    .branch.left {
        left: -55%;
    }

    .branch.right {
        left: 55%;
    }
}

@include breakpoint('xxs') {
    .branch {
        height: 12%;
    }
}

@include breakpoint('xs') {
    .branch {
        height: 14%;
    }
}

@include breakpoint('sm') {
    .branch {
        height: 18%;
    }
}

@include breakpoint('lg') {
    .branch {
        height: 24%;
    }
}


.branch-1 {
    background-image: url(@/assets/welcome-parallax/parts/branch_1.png);
}

.branch-2 {
    background-image: url(@/assets/welcome-parallax/parts/branch_2.png);
}

.branch-3 {
    background-image: url(@/assets/welcome-parallax/parts/branch_corner.png);
}

@keyframes branch-shake {
  0% {
    transform: skewX(-5deg) translate(0px) scale(-2, 2);
  }
  25% {
    transform: skewX(5deg) translate(-5px) scale(-2, 2);
  }
  50% {
    transform: skewX(-5deg) translate(0px) scale(-2, 2);
  }
  75% {
    transform: skewX(5deg) translate(5px) scale(-2, 2);
  }
  100% {
    transform: skewX(-5deg) translate(0px) scale(-2, 2);
  }
}

@keyframes branch-shake-right {
  0% {
    transform: skewX(-5deg) translate(0px) scale(2);
  }
  25% {
    transform: skewX(5deg) translate(-5px) scale(2);
  }
  50% {
    transform: skewX(-5deg) translate(0px) scale(2);
  }
  75% {
    transform: skewX(5deg) translate(5px) scale(2);
  }
  100% {
    transform: skewX(-5deg) translate(0px) scale(2);
  }
}
</style>