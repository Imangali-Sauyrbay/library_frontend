<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import AppLoader from '@/components/AppLoader.vue'
import { ensureImagesAreLoaded, urlsToAllAssets } from './utils/parallaxImages'
import ParallaxContainer from './components/ParallaxContainer.vue'
import ParallaxScene from './components/ParallaxScene.vue'
import ParallaxItems from './components/ParallaxItems.vue'

const { t } = useI18n()

const loading = ref(true)
const text = ref(t('app.loader.text'))
const lastProgress = ref<number>(Date.now())
const stopTimeout = ref<number>(0)

const warn = () => {
    if(! loading.value) return
    loading.value = false

    ElMessage({
        type: 'warning',
        message: t('pages.welcome.imagesNotLoadedMsg'),
        duration: 7000
    })
}

const TIME_OUT = 15000

watch(lastProgress, () => {
    clearTimeout(stopTimeout.value)

    if (!loading.value) return

    stopTimeout.value = window.setTimeout(() => {
        loading.value = false
        warn()
    }, TIME_OUT)
})

onMounted(() => {
    ensureImagesAreLoaded(urlsToAllAssets, 100,
    (total, loaded) => {
        text.value = t('pages.welcome.imageProgressMsg', [loaded, total])
        lastProgress.value = Date.now()
    })
    .catch(warn)
    .finally(() => {
        loading.value = false
    })
})
</script>

<template>
    <AppLoader v-if="loading" :text="text"/>
    <ParallaxContainer v-else class="preventOverscrollReload">
        <ParallaxScene>
            <ParallaxItems />
        </ParallaxScene>
    </ParallaxContainer>
    
</template>

<style>
    body {
        overscroll-behavior-y: contain;
    }
</style>
