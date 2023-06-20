<script lang="ts" setup>
import { clamp } from '@/utils/Clamp'
import type { IParallaxPlant } from './../../utils/types'
import { randomFloat } from '@/utils/Random'
import { ref } from 'vue'
import { images } from '@/components/welcome-page/parallax/utils/parallaxImages'

type prop = {
    item: IParallaxPlant
}

const props = defineProps<prop>()

const branchUrlMap: {
    [key: number]: string
} = {
    1: new URL('@/assets/welcome-parallax/parts/branch_1.png', import.meta.url).href,
    2: new URL('@/assets/welcome-parallax/parts/branch_2.png', import.meta.url).href,
    3: new URL('@/assets/welcome-parallax/parts/branch_corner.png', import.meta.url).href
}

const number = clamp(
    props.item.classes?.reduce((acc: number, className: string) => {
        const regex = /^branch-(\d+)$/
        const match = className.match(regex);

        if(match) {
            return parseInt(match[1], 10)
        }
        
        return acc;
    }, 1) || 1,
    1,
    3
)

const url = ref(images.has(branchUrlMap[number]) ? images.get(branchUrlMap[number]) : branchUrlMap[number])
</script>

<template>
    <div class="branch" :class="item.classes" :style="{
        top: item.style.top + '%',
        animationDelay: randomFloat(0, 2) + 's',
        backgroundImage: `url(${url})`
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

  .branch-1 {
    height: 8%;
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

  .branch-1 {
    height: 9%;
  }

}

@include breakpoint('xs') {
  .branch {
    height: 14%;
  }

  .branch-1 {
    height: 11%;
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