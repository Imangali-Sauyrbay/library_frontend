<script setup lang="ts">
import { ElIcon } from 'element-plus'
import { CloseBold } from '@element-plus/icons-vue'

defineEmits<{
    (event: 'clicked'): void
}>()
</script>

<template>
    <div class="close" @click.stop="$emit('clicked')">
        <el-icon color="white"><CloseBold /></el-icon>
    </div>
</template>

<style scoped lang="scss">
@import '@/main.scss';

.close {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 50px;
    height: 40px;

    border: 2px solid rgba(255, 255, 255, 0.5);
    border-bottom-left-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 1s ease-in-out;
    font-size: 30px;
}

.close > i {
    font-size: inherit;
}

.closed .close {
    display: none
}

.transition-active .close {
    opacity: 0;
    display: flex;
}

@include breakpoint('xl') { 
    .close {
        width: 70px;
        height: 50px;
        font-size: 40px;
    }
}

@include breakpoint('xxl') {
    .close {
        width: 100px;
        height: 70px;
        font-size: 46px;
    }
}
</style>