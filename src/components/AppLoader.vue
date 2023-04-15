<script lang="ts" setup>
    import { onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue';
    import { ElLoading } from 'element-plus'
    import 'element-plus/es/components/loading/style/css'

    const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
    
    const props = defineProps<{ text?: string, background?: string }>();
    const loader = ref<{close: () => void, setText: (text: string) => void} | null>(null);

    watch(() => props.text, () => {
        loader.value?.setText(props?.text || '')
    })
    
    onBeforeMount(() => {
        loader.value = ElLoading.service({
            background: props.background || 'transparent',
            lock: true,
            svg,
            fullscreen: true,
            svgViewBox: '-10, -10, 50, 50'
        })
    })

    onMounted(() => {
        loader.value?.setText(props?.text || '')
    })

    onBeforeUnmount(() => {
        loader.value?.close()
    })
</script>

<template>
    <i></i>
</template>