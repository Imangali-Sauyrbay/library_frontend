<script setup lang="ts">
import {
    ElAside,
    ElSkeleton,
    ElSkeletonItem
} from 'element-plus'
</script>

<template>
    <ElAside class="aside">
        <nav class="nav">
            <ElSkeleton animated class="skeleton" v-for="i in 4" :key="i">
                <template #template>
                    <ElSkeletonItem variant="rect" class="icon"/>
                </template>
            </ElSkeleton>
        </nav>
    </ElAside>
</template>

<style scoped lang="scss">
.aside {
    background-color: #ccc;
    width: fit-content;
    transition: all .4s ease-in-out;
    width: 60px;
    .hide-nav & {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;

        transform: translateX(-150%);
    }
}

.skeleton {
    width: 100%;
    height: calc(fit-content + 5px);
}

.nav {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.icon {
    width: 100%;
    height: 60px;
    cursor: pointer;
}
</style>