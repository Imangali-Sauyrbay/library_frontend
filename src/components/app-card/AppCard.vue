<script setup lang="ts">
import AppLogo from '@/components/icons/AppLogo.vue'

import { ElCard } from 'element-plus'

import {ref, type ComponentPublicInstance } from 'vue'

const card = ref<ComponentPublicInstance>()

defineExpose({card})
defineProps<{showLogo?: boolean}>()
</script>

<template>
    <ElCard class="card" ref="card">
        <RouterLink v-if="showLogo ?? true" :to="{name: 'home'}" custom v-slot="{navigate}">
            <AppLogo @click="navigate" class="logo" fit="contain" />
        </RouterLink>
        <slot></slot>
    </ElCard>
</template>

<style scoped lang="sass">
@use "@/main.scss" as *

.card
    text-align: center

.logo
    width: 100px
    height: 100px
    user-select: none
    margin: 1rem auto
    cursor: pointer
    fill: #8400ff

    @include breakpoint('xxxs')
        width: 50px
        height: 50px
</style>