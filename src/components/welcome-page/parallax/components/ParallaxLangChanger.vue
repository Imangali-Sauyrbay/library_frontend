<script setup lang="ts">
import { ref } from 'vue'
import { ElIcon } from 'element-plus'
import LanguageIcon from '@/components/icons/LanguageIcon.vue'
import AppLangChangeDialog from '@/components/AppLangChangeDialog.vue'

const emit = defineEmits<{
    (event: 'changed'): void
}>()

const dialogVisible = ref(false)
</script>

<template>
    <div class="lang" @click.stop="dialogVisible = true">
        <ElIcon color="white">
            <LanguageIcon />
        </ElIcon>
    </div>

    <AppLangChangeDialog
    v-model="dialogVisible"
    @changed="emit('changed')"
    :modal="false"
    :show-close="false"
    top="5vh"/>
</template>

<style scoped lang="scss">
@import '@/main.scss';

.lang {
    position: absolute;
    top: -2px;
    left: -2px;
    width: 50px;
    height: 45px;
    transform: translateY(98%);

    border: 2px solid rgba(255, 255, 255, 0.5);
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all .5s ease-in-out;
    font-size: 30px;
    
    @include breakpoint('xxxs') {
        opacity: 1;
    }

    @include breakpoint('xxs') {
        opacity: 0.7;
    }

    @include breakpoint('sm') {
        opacity: 0.4;
    }

    &:hover, &:active, &:focus {
        opacity: 1;
    }
}

.lang>i {
    font-size: inherit;
}

.closed .lang {
    display: none
}

.transition-active .lang {
    opacity: 0;
    display: flex;
}

@include breakpoint('xl') {
    .lang {
        width: 70px;
        height: 50px;
        font-size: 40px;
    }
}

@include breakpoint('xxl') {
    .lang {
        width: 100px;
        height: 70px;
        font-size: 46px;
    }
}
</style>
