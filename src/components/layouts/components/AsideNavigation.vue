<script setup lang="ts">
import {
    ElAside,
    ElTooltip,
    ElIcon
} from 'element-plus'
import { useI18n } from 'vue-i18n'

import type { NavProps } from './types'

defineProps<{paths: NavProps[]}>()

const { t } = useI18n()
</script>

<template>
    <ElAside class="aside">
        <nav class="nav">
            <RouterLink
            v-for="({name, icon, exact=true}) in paths"
            :key="name"
            :to="{name: name}"
            custom
            v-slot="{ navigate, isExactActive, isActive}">
                <ElTooltip effect="dark" placement="right" :content="t('pages.nav.' + name)">
                    <ElIcon @click="navigate" class="icon" :class="{active: exact ? isExactActive : isActive}">
                        <component :is='icon.value'></component>
                    </ElIcon>
                </ElTooltip>
            </RouterLink>
        </nav>
    </ElAside>
</template>

<style scoped lang="scss">
.aside {
    background-color: #ccc;
    width: fit-content;
    transition: all .4s ease-in-out;
    z-index: 999;

    .hide-nav & {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;

        transform: translateX(-150%);
    }
}

.nav {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.icon {
    --color: white;
    font-size: 30px;
    padding: 1rem;
    width: fit-content;
    height: fit-content;
    cursor: pointer;
    transition: all .2s ease-in-out;

    &.active {
        background-color: darken($color: #ccc, $amount: 10);
        --color: #6d00fc;
    }

    &:hover {
        background-color: darken($color: #ccc, $amount: 5);
        --color: #8240d8;
    }

}
</style>