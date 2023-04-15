<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElIcon, ElMessage } from 'element-plus'
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
        <el-icon color="white">
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 92.91">
                <title>language</title>
                <path
                    d="M20.15,83.63,31.63,73.4a2.89,2.89,0,0,1,1.91-.73h27.8a.92.92,0,0,0,.93-.93V65.9H68v5.84a6.71,6.71,0,0,1-6.68,6.68H34.62L19.3,92.07a2.87,2.87,0,0,1-4.9-2V78.42H6.69A6.71,6.71,0,0,1,0,71.74V28.59a6.76,6.76,0,0,1,6.69-6.68H43.35v5.75H6.69a1,1,0,0,0-.94.93V71.74a.91.91,0,0,0,.28.65,1,1,0,0,0,.66.28H17.27a2.88,2.88,0,0,1,2.88,2.88v8.08Zm.21-19.48L29.6,36.24h8.83l9.24,27.91H40.35L38.8,59.07H29.15l-1.51,5.08ZM30.79,53.24h6.37L34,41.81,30.79,53.24ZM76.63,13.35h8.7V11.11a.69.69,0,0,1,.69-.69h4.65a.68.68,0,0,1,.68.69v2.24h9.76a.68.68,0,0,1,.68.69V18.5a.68.68,0,0,1-.68.68H99.56a26.3,26.3,0,0,1-.91,3.88l0,.06a26.07,26.07,0,0,1-1.74,4.15,32.34,32.34,0,0,1-2.14,3.43c-.67,1-1.41,1.9-2.2,2.83a35.78,35.78,0,0,0,3.68,3.83,41.43,41.43,0,0,0,5.09,3.74.68.68,0,0,1,.21.94l-2.39,3.73a.69.69,0,0,1-1,.2,45.88,45.88,0,0,1-5.58-4.08l0,0a41.42,41.42,0,0,1-4-4.1C87.3,38.93,86.15,40,85,41l0,0c-1.36,1.12-2.79,2.2-4.47,3.36a.69.69,0,0,1-1-.17L77,40.53a.69.69,0,0,1,.17-1c1.66-1.14,3-2.19,4.36-3.28,1.16-1,2.28-2,3.49-3.16a44.82,44.82,0,0,1-2.77-4.45A28.84,28.84,0,0,1,80,22.9a.68.68,0,0,1,.47-.84l4.27-1.19a.68.68,0,0,1,.84.47A22.62,22.62,0,0,0,89,28.7L90.27,27a26.33,26.33,0,0,0,1.51-2.47l0,0A19.43,19.43,0,0,0,93,21.62a24,24,0,0,0,.66-2.44h-17a.69.69,0,0,1-.69-.68V14a.69.69,0,0,1,.69-.69Zm27,56.82L88.26,56.51H61.54a6.73,6.73,0,0,1-6.69-6.68V6.69a6.71,6.71,0,0,1,2-4.72l.2-.18A6.67,6.67,0,0,1,61.54,0h54.65a6.69,6.69,0,0,1,4.71,2l.19.2a6.69,6.69,0,0,1,1.79,4.51V49.83a6.73,6.73,0,0,1-6.69,6.68h-7.7V68.13a2.88,2.88,0,0,1-4.91,2ZM91.26,51.49l11.47,10.23V53.64a2.88,2.88,0,0,1,2.88-2.88h10.58a.92.92,0,0,0,.65-.28.91.91,0,0,0,.29-.65V6.69a1,1,0,0,0-.22-.58L116.84,6a1,1,0,0,0-.65-.29H61.54A.94.94,0,0,0,61,6L60.89,6a.92.92,0,0,0-.28.65V49.83a.92.92,0,0,0,.93.93H89.35a2.86,2.86,0,0,1,1.91.73Z" />
            </svg>
        </el-icon>
    </div>
    <AppLoader
    v-if="loading"
    background="rgba(0, 0, 0, 0.5)"
    :text="t('lang.loading', {lang: getTranslate(form.lang)})"
    />
    <el-dialog
    v-model="dialogVisible"
    :title="t('lang.title')"
    @click.stop width="fit-content"
    :modal="false"
    :show-close="false"
    class="modal"
    top="5vh"
    center>
            <div style="margin: auto">
                <el-form :model="form">
                    <el-select
                    v-model="form.lang"
                    :placeholder="t('lang.placeholders.select')"
                    :teleported="false">
                        <el-option
                        v-for="locale in SUPPORT_LOCALES"
                        :label="getTranslate(locale)"
                        :value="locale" :key="locale"/>
                    </el-select>
                </el-form>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click.stop="cancelled">
                        {{ t('app.actions.cancel') }}
                    </el-button>
                    <el-button type="primary" @click.stop="confirmed">
                        {{ t('app.actions.confirm') }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
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
