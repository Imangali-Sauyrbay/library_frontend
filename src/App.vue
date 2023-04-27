<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { KEY, asyncSetLocale, SUPPORT_LOCALES, type LocaleValue } from '@/i18n'
import AppProgressBar from './components/AppProgressBar.vue'
const shouldUseTransition = ref(false)


onMounted(() => {
  setTimeout(() => {
    shouldUseTransition.value = true
  }, 6000)
  
  const lang = localStorage.getItem(KEY)

  if(lang && SUPPORT_LOCALES.includes(lang as LocaleValue)) {
    asyncSetLocale(lang as LocaleValue)
  }
})
</script>

<template>
  <AppProgressBar />
  <RouterView v-slot="{ Component }">
    <Transition :name="shouldUseTransition? 'slide-left' : ''" :appear="false">
      <component :is="Component" @vnode-mounted="shouldUseTransition = true"></component>
    </Transition>
  </RouterView>
</template>

<style>
.slide-left-enter-active,
.slide-left-leave-active {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all .3s ease-in-out !important;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>
