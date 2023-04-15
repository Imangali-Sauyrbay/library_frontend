<script lang="ts" setup>
import AppFullLogo from '@/components/AppFullLogo.vue'
import debounce from '@/utils/Debounce';
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import { toLocalePercent, calculatePixelValues } from './images/utils'
import ParallaxCloseButton from './ParallaxCloseButton.vue'
import ParallaxWave from './ParallaxWave.vue'
import ParallaxExclamation from './ParallaxExclamation.vue'
import ParallaxProgress from './ParallaxProgress.vue'
import ParallaxSoundButton from './ParallaxSoundButton.vue'
import ParallaxSoundPlayer from './ParallaxSoundPlayer.vue'
import ParallaxLangChanger from './ParallaxLangChanger.vue'

const isOpened = ref(true)
const isSoundOn = ref(false)
const widthChanged = ref(false)
const isReady = ref(false)
const card = ref<HTMLDivElement>()
const wrapper = ref<HTMLDivElement>()
const maxRect = ref<DOMRect>()
const minRect = ref<DOMRect>()
const transform = ref('')
const isTransitionActive = ref(false)
const progress = ref(0)
const SHOW_TIME = 7000


const { show, hide } = (() => {
    const setZIndex = (index: string) => () => {
        if(!card.value) return

        const parent = card.value.parentElement

        parent!.style.zIndex = index
    }

    return {
        show: setZIndex('999'),
        hide: setZIndex(''),
    }
})()

const getTranslate = (
    rect: DOMRect,
    x: number,
    y: number,
    offsetX: string = '50%',
    offsetY: string = '50%'
) => {
    const w = rect.width
    const h = rect.height
    const {localX, localY} = toLocalePercent(x, y, w, h)
    return `translate(calc(${calculatePixelValues(localX, w)}px - ${offsetX}), calc(${calculatePixelValues(localY, h)}px - ${offsetY}))`
}

const getTranslateByToggle = (): string => {
    if(minRect.value !== undefined && maxRect.value !== undefined) {
        return getTranslate(
            isOpened.value ? minRect.value : maxRect.value,
            50,
            isOpened.value ? 50 : 100,
            '50%',
            isOpened.value ? '50%' : '35%'
        )
    }
    return ''
}

const setCardHeight = () => {
    const h = wrapper.value?.scrollHeight
    if(h) {
        card.value!.style.setProperty('--height', h + 'px')
    }
}

const transitionEnd = () => {
    isTransitionActive.value = false
    if(widthChanged.value) {
        setCardHeight()
        widthChanged.value = false
    }
}

const setTransform = () => {
    if(minRect.value !== undefined && maxRect.value !== undefined) {
        transform.value = getTranslateByToggle()
    }
}

const toggle = () => {
    isOpened.value = !isOpened.value
    isTransitionActive.value = true
    setTransform()
}

watch(isOpened, () => {
    if (isTransitionActive.value) return
    isTransitionActive.value = true
    setTransform()
})

const snapshotCardRect = () => {
    if(!card.value) {
        setTimeout(snapshotCardRect, 1000)
        return
    }

    const defaultValue = card.value.classList.contains('closed')

    card.value.style.transition = 'unset'

    card.value.classList.add('closed')
    minRect.value = card.value.getBoundingClientRect()

    card.value.classList.remove('closed')
    maxRect.value = card.value.getBoundingClientRect()

    if(defaultValue) {
        card.value.classList.add('closed')
    }

    card.value.style.transform = getTranslateByToggle()
    transform.value = getTranslateByToggle()
    card.value.style.transition = ''
}

const hideTimeOut = ref<number>()

const toggleZIndex = () => {
    clearTimeout(hideTimeOut.value)

    show()

    hideTimeOut.value = window.setTimeout(hide, SHOW_TIME)
    progress.value = 100
}

const onResize = () => {
    setTransform()
    widthChanged.value = true
}

onMounted(() => {
    snapshotCardRect()
    setCardHeight()
    setTimeout(() => {
        isReady.value = true
    },1000)
    window.addEventListener('resize', debounce(onResize, 500))
})

onBeforeMount(() => {
    window.removeEventListener('resize', debounce(onResize, 500))
})
</script>

<template>
    <div
    class="card"
    :class="{
        closed: !isOpened,
        'transition-active': isTransitionActive,
        'use-transition': isReady
    }"
    :style="{transform}"
    @click.stop="toggle"
    @transitionend="transitionEnd"
    ref="card">
        <ParallaxWave />

        <div class="wrapper" ref="wrapper" @click.stop="toggleZIndex">
            <ParallaxSoundButton :isOn="isSoundOn" @clicked="isSoundOn = !isSoundOn"/>
            <ParallaxLangChanger @changed="setCardHeight"/>
            <ParallaxCloseButton @clicked="toggle"/>
            <AppFullLogo class="logo"/>
            <div class="content">
                <slot></slot>
            </div>
        </div>

        <ParallaxExclamation />
        <ParallaxSoundPlayer :isMuted="!isSoundOn"/>
        <ParallaxProgress
        :progress="progress"
        :duration="SHOW_TIME"
        @progress-started="progress = 50"
        @progress-ended="progress = 0"
        />
    </div>
</template>

<style scoped lang="scss">
@import '@/main.scss';
.card {
    position: absolute;
    top: 0;
    left: 0;
    width: 95%;
    height: 360px;
    background: transparent;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    background-size: cover;
    background-position: center;
    border-radius: 20px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    z-index: 5;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
}

.wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 1rem;
    align-items: center;
    z-index: 6;
    transition: all 1s ease-in-out;
}

.use-transition {
    transition: all 1.5s ease-in-out;
}
.logo {
    width: 60%;
    opacity: 1;
    transition: all 1s ease-in-out;
}

.card::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    z-index: -1;
    border-radius: inherit;
    background-color: #6927ab;
    opacity: 0.3;
    filter: blur(20px);
}

.card::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    z-index: -2;
    border-radius: inherit;
    background-image: radial-gradient(transparent 60%, rgba(105, 39, 171, .7));
}

.content {
    position: relative;
    z-index: 1;
    text-align: center;
    color: #fff;
    padding: 20px;
    overflow: hidden auto;
    scrollbar-width: thin;
    scrollbar-color: gray transparent;
    opacity: 1;
    transition: all 1s ease-in-out;
    margin-bottom: calc(45px - 1rem);

    @include breakpoint('xl') {
        margin-bottom: calc(55px - 1rem);
    }

    @include breakpoint('xxl') {
        margin-bottom: calc(75px - 1rem);
    }
}
.content::-webkit-scrollbar {
  width: 5px;
}
.content::-webkit-scrollbar-thumb {
  background-color:  rgba(240, 225, 255, 0.7);
  border-radius: 5px;
  border: none;
}

.card.closed {
    width: 50px;
    height: 50px;
    padding: 0;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
}

.closed .content,
.closed .logo,
.closed .wrapper {
    display: none;
    overflow: hidden;
}

.transition-active .content,
.transition-active .logo {
    opacity: 0;
    display: block;
}

.transition-active .wrapper {
    opacity: 0;
    display: flex;
    overflow: hidden;
}

.transition-active .content {
    overflow: hidden;
}

@include breakpoint('xxs') {
    .card {
        width: 85%;
        height: 360px
    }

    .logo {
        width: 200px;
    }
}

@include breakpoint('xs') {
    .card {
        width: 75%;
        height: 320px
    }
}

@include breakpoint('sm') { 
    .card {
        width: 70%;
        height: 340px
    }
}

@include breakpoint('md') { 
    .card {
        width: 600px;
        height: 350px;
    }
}

@include breakpoint('lg') {
    .card.closed {
        width: 70px;
        height: 70px;
    }
}

@include breakpoint('xl') { 
    .card {
        width: 700px;
        height: 450px;
    }
}

@include breakpoint('xxl') { 
    .card {
        width: 900px;
        height: 650px;
    }

    .logo {
        width: 400px;
    }

    .card.closed {
        width: 5vw;
        height: 5vw;
    }
}

.card {
    height: var(--height);
}
</style>
