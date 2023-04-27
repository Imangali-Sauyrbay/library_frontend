<script setup lang="ts">
import {
    ElFooter,
    ElRow,
    ElCol,
    ElSkeleton,
    ElSkeletonItem
} from 'element-plus'
</script>

<template>
    <ElFooter class="footer">
        <nav class="nav">
            <ElRow class="h100" justify="space-evenly">
                <ElCol :span="6" v-for="i in 4" :key="i">
                    <ElSkeleton animated class="skeleton">
                        <template #template>
                            <ElSkeletonItem variant="rect" class="icon"/>
                        </template>
                    </ElSkeleton>
                </ElCol>
            </ElRow>
        </nav>
    </ElFooter>
</template>

<style scoped lang="scss">
.h100 {
    height: 100%;
}

.footer {
    background-color: #ccc;
    box-shadow: 0 0 10px 0 black;
    z-index: 9999;

    transition: all .4s ease-in-out;

    .hide-nav & {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;

        transform: translateY(150%);
    }
}

.skeleton, .icon, .nav {
    width: 100%;
    height: 100%;
}

.icon {
    width: 70px;
    cursor: pointer;
}
</style>