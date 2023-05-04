<script setup lang="ts">
import useMobileDevice from '@/hooks/useMobileDevice'
import Logo from '@/assets/full-logo.svg'
import AsideNavigationSkeleton from './components/AsideNavigationSkeleton.vue'
import BottomNavigationSkeleton from './components/BottomNavigationSkeleton.vue'

import {
    ElContainer,
    ElMain,
    ElHeader,
    ElRow,
    ElCol,
    ElImage,
} from 'element-plus'
import { defineAsyncComponent, shallowRef } from 'vue'
import { HomeFilled, Menu, Search } from '@element-plus/icons-vue'
import QrScan from '@/components/icons/QrScan.vue'

const AsideNavigation = defineAsyncComponent({
    loader: () => import('@/components/layouts/components/AsideNavigation.vue'),
    loadingComponent: AsideNavigationSkeleton
})

const BottomNavigation = defineAsyncComponent({
    loader: () => import('@/components/layouts/components/BottomNavigation.vue'),
    loadingComponent: BottomNavigationSkeleton
})

const { isMobile } = useMobileDevice()

const mobile = isMobile()

const paths = [
    {
        name: 'home',
        icon: shallowRef(HomeFilled)
    },
    {
        name: 'scan',
        icon: shallowRef(QrScan)
    },
    {
        name: 'search',
        icon: shallowRef(Search)
    },
    {
        name: 'menu',
        icon: shallowRef(Menu),
        exact: false
    }
]
</script>

<template>
    <ElContainer class="main-container">
        <ElHeader class="header">
            <ElRow :justify="'space-between'">
                <ElCol :span="4">
                    <ElImage class="logo" :src="Logo" fit="contain"/>
                </ElCol>
                <ElCol :span="4">
                    <!-- AVATAR -->
                </ElCol>
            </ElRow>
        </ElHeader>
        <ElContainer class="middle-container">
            <AsideNavigation :paths="paths" v-if="!mobile"/>
            <ElMain class="main" :style="{ paddingBottom: mobile ? '60px' : ''} ">
                <slot></slot>
            </ElMain>
        </ElContainer>
        <BottomNavigation :paths="paths" v-if="mobile"/>
    </ElContainer>
</template>

<style scoped lang="scss">
.header {
    --el-header-padding: 5px 20px;
    --el-header-height: 60px;
    background-color: #ccc;
    box-shadow: 0 0 10px 0 black;
    z-index: 1000;
}

.main-container, .main, .middle-container {
    width: 100%;
    height: 100%;
}

.main {
    --el-main-padding: 0;
    position: relative;
}
.middle-container {
    position: relative;
    height: calc(100% - 60px);
}

.logo {
    height: 100%;
    width: 100px;
}
</style>