<template>
    <div class="card">
        <h2>Page Not Found!</h2>
        <p>Error code 404!</p>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
onMounted(() => console.log('Not Found Page'))
</script>

<style scoped>
.card {
    text-align: center;
}

.card > h2 {
    font-weight: bold;
    color: red;
    margin-top: 2rem;
    text-shadow: 3px 3px 5px #ccc, 3px 3px 5px #ccc, 3px 3px 5px #ccc;
}

.card > p {
    text-shadow: 3px 3px 5px #ccc, 3px 3px 5px #ccc, 3px 3px 5px #ccc;
}
</style>