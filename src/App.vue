<script setup lang="ts">
import { onMounted } from 'vue'
import { KEY, asyncSetLocale, SUPPORT_LOCALES, type LocaleValue } from '@/i18n'

onMounted(() => {
  const lang = localStorage.getItem(KEY)

  if(lang && SUPPORT_LOCALES.includes(lang as LocaleValue)) {
    asyncSetLocale(lang as LocaleValue)
  }
})
</script>

<template>
  <router-view />
</template>

<style scoped lang="scss">

</style>
