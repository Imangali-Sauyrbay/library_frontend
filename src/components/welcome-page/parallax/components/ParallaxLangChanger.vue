<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
    ElIcon,
    ElMessage,
    ElDialog,
    ElForm,
    ElSelect,
    ElOption,
    ElButton
} from 'element-plus'
import LanguageIcon from '@/components/icons/LanguageIcon.vue'

import { useI18n } from 'vue-i18n'
import { asyncSetLocale, SUPPORT_LOCALES, type LocaleValue } from '@/i18n'
import AppLoader from '@/components/AppLoader.vue'

const emit = defineEmits<{
    (event: 'changed'): void
}>()

const { t, locale } = useI18n()
const dialogVisible = ref(false)
const loading = ref(false)

const getTranslate  = (locale: LocaleValue) => {
    return t('lang.languages.' + locale)
}

const form = reactive<{lang: LocaleValue}>({
    lang: locale.value as LocaleValue
})

const cancelled = () => {
    dialogVisible.value = false
    form.lang = locale.value as LocaleValue
}

const confirmed = () => {
    dialogVisible.value = false
    loading.value = true

    asyncSetLocale(form.lang)
    .then(() => {
        emit('changed')
    })
    .catch(() => {
        ElMessage({
            type: 'error',
            message: t('lang.error', {lang: getTranslate(form.lang)}),
            duration: 7000
        })

        cancelled()
    })
    .finally(() => {
        loading.value = false
    })
}
</script>

<template>
    <div class="lang" @click.stop="dialogVisible = true">
        <ElIcon color="white">
            <LanguageIcon />
        </ElIcon>
    </div>
    <AppLoader
    v-if="loading"
    background="rgba(0, 0, 0, 0.5)"
    :text="t('lang.loading', {lang: getTranslate(form.lang)})"
    />
    <ElDialog
    v-model="dialogVisible"
    :title="t('lang.title')"
    @click.stop width="fit-content"
    :modal="false"
    :show-close="false"
    class="modal"
    top="5vh"
    center>
        <div style="margin: auto">
            <ElForm :model="form">
                <ElSelect
                v-model="form.lang"
                :placeholder="t('lang.placeholders.select')"
                :teleported="false">
                    <ElOption
                    v-for="locale in SUPPORT_LOCALES"
                    :label="getTranslate(locale)"
                    :value="locale" :key="locale"/>
                </ElSelect>
            </ElForm>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <ElButton @click.stop="cancelled">
                    {{ t('app.actions.cancel') }}
                </ElButton>
                <ElButton type="primary" @click.stop="confirmed">
                    {{ t('app.actions.confirm') }}
                </ElButton>
            </span>
        </template>
    </ElDialog>
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

<style>
    .modal {
        border-radius: 20px;
    }
</style>
