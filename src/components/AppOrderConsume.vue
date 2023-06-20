<script setup lang="ts">
import OrderService from '@/services/OrderService'
const service = new OrderService()
service.connectPrivateChannel('orders').listen('OrdersUpdated', () => {
    console.log()
})
</script>

<template>
    <div class="container">
        Consumer
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