<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    text: string,
    phrase: string
}>()
const escapedPhrase = props.phrase.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

const splitText = computed(() => props.text.split(new RegExp(`(${escapedPhrase})`, 'ig')))
</script>

<template>
    <p>
      <span
        v-for="(part, index) in splitText"
        :key="index"
        :class="{ 'highlight': part === escapedPhrase }"
      >
        {{ part }}

      </span>
    </p>
  </template>
  
  <style>
  .highlight {
    background-color: yellow;
  }
  </style>
  
