<script setup lang="ts">
import {ElSkeleton, ElSkeletonItem} from 'element-plus'
import AppCardWrapper from '@/components/app-card/AppCardWrapper.vue'
import { useSessionStorage } from '@vueuse/core'

const sessionPos = useSessionStorage('appDraggablePosition', '0;0')
const [x, y] = sessionPos.value.split(';').map(parseFloat)
const isPosExist = x !== 0 && y !== 0
</script>

<template>
    <AppCardWrapper
    class="card"
    :class="{
        center: !isPosExist
    }"
    :style="[isPosExist ? {top: y + 'px', left: x + 'px'} : '']">
        <ElSkeleton style="width: 100%" animated>
            <template #template>
            <ElSkeletonItem variant="rect" class="logo" />
            <div class="items-container">
                <ElSkeletonItem variant="p" style="width: 50%" />

                <div class="items-wrapper">
                    <ElSkeletonItem variant="text" style="margin-right: 16px" />
                    <ElSkeletonItem variant="text" style="width: 30%" />
                </div>

                <ElSkeletonItem variant="h1" style="width: 80%;"/>

                <div class="items-wrapper">
                    <ElSkeletonItem variant="h3" style="width: 20%; margin-right: 16px"/>
                    <ElSkeletonItem variant="h3" style="width: 70%;"/>
                </div>
                <ElSkeletonItem variant="h1" style="width: 80%;"/>
                <br>
                <div class="right">
                    <ElSkeletonItem variant="button" class="btn"/>
                </div>
            </div>
            </template>
        </ElSkeleton>
    </AppCardWrapper>
</template>

<style scoped lang="scss">
@use "@/main.scss" as *;

.center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.card {
    position: absolute;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    padding: 20px;
    background-color: #ffffff;
    border-radius: 4px;
    border: 1px solid #e4e7ed;
    overflow: hidden;


    width: 480px;
    height: 471px;
    max-width: 90vw;

    @include breakpoint('xxxs') {
        max-width: 98vw;
    }
}

.dark .card {
    background-color: #1d1e1f;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.72);
    border-color: #414243;
}

.logo {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 100px;
    margin: 1rem auto;
}

.items-container {
    padding: 14px;

    & > * {
        margin-top: 16px;
    }

    &:first-child {
        margin-top: 0;
    }
}

.items-wrapper {
    display: flex;
    align-items: center;
    justify-items: space-between;
}

.btn {
    height: 32px;
    width: 90px;
}

.right {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
}
</style>