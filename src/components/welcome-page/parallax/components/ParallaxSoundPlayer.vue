<script setup lang="ts">
import { ref, watch } from 'vue'
import sound from '@/assets/welcome-parallax/sounds/breeze.mp3'

const audio = ref<HTMLAudioElement>()
const props = defineProps<{isMuted: boolean}>()

watch(() => props.isMuted, () => {
    props.isMuted ? audio.value?.pause() : audio.value?.play()
})
</script>

<template>
    <audio
    :src="sound"
    loop="true"
    preload="true"
    ref="audio">
    </audio>
</template>
