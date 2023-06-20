<script setup lang="ts">
import {
    ElButton
} from 'element-plus'

import { CirclePlus } from '@element-plus/icons-vue'
</script>

<template>
    <div class="container">
        <ElButton
        class="add-new-btn"
        type="primary"
        :icon="CirclePlus"
        plain>Order</ElButton>
    </div>
</template>

<style scoped>
.container {
    padding-top: 10px;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.add-new-btn {
    width: 95%;
    max-width: 500px;
}
</style>