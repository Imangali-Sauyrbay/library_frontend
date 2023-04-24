<script setup lang="ts">
import {
    ElFooter,
    ElIcon,
    ElRow,
    ElCol
} from 'element-plus'
import { useI18n } from 'vue-i18n'
import type { NavProps } from './types'
import { computed } from 'vue';


const { t } = useI18n()

const props = defineProps<{paths: NavProps[]}>()
const toAllocate = computed(() => Math.floor(24 / props.paths.length))
</script>

<template>
    <ElFooter class="footer">
        <nav class="nav">
            <ElRow class="h100" justify="space-evenly">
                <ElCol :span="toAllocate" v-for="({name, icon, exact = true}) in paths" :key="name">
                    <RouterLink :to="{name}" custom v-slot="{ navigate, isExactActive, isActive}">
                        <div class="nav-link" @click="navigate" :class="{active: exact ? isExactActive : isActive}">
                            <ElIcon class="nav-icon">
                                <component :is='icon.value'></component>
                            </ElIcon>
                            <span class="nav-text">{{ t('pages.nav.' + name) }}</span>
                        </div>
                    </RouterLink>
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
    z-index: 999;

    transition: all .4s ease-in-out;

    .hide-nav & {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;

        transform: translateY(150%);
    }
}

.nav {
    width: 100%;
    height: 100%;
}

.nav-link {
    --color: white;
    font-size: 30px;
    width: 100%;
    height: 100%;
    max-width: 90px;
    min-width: 60px;
    transition: all .2s ease-in-out;
    cursor: pointer;
    position: relative;
    margin: 0 auto;

    &.active {
        background-color: darken($color: #ccc, $amount: 10);
        --color: #6d00fc;
    }

    &:hover {
        background-color: darken($color: #ccc, $amount: 5);
        --color: #8240d8;
    }
}

.nav-text {
    position: absolute;
    left: -100%;
    right: -100%;
    bottom: 0;
    font-size: 40%;
    text-align: center;
    color: var(--color);
    transition: all .2s ease-in-out;
    transform: translateY(100%);

    .active & {
        transform: translateY(-20%);
    }
}

.nav-icon {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all .2s ease-in-out;


    .active & {
        transform: translate(-50%, -100%);
    }
}
</style>