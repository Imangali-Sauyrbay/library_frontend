<script setup lang="ts">
import AppCardWrapper from './AppCardWrapper.vue'
import AppCard from './AppCard.vue'
import { ref, type ComponentPublicInstance } from 'vue'

const card = ref<{card: ComponentPublicInstance}>()

defineProps({
    showLogo: {
        type: Boolean,
        default: true,
        required: false
    }
})

defineExpose({card})
</script>

<template>
    <AppCardWrapper>
        <AppCard :show-logo="showLogo" ref="card">
            <slot></slot>
        </AppCard>
    </AppCardWrapper>
</template>
