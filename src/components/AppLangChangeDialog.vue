<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
    ElMessage,
    ElDialog,
    ElForm,
    ElSelect,
    ElOption,
    ElButton
} from 'element-plus'

import { useI18n } from 'vue-i18n'
import { asyncSetLocale, SUPPORT_LOCALES, type LocaleValue } from '@/i18n'
import AppLoader from '@/components/AppLoader.vue'

const emit = defineEmits<{
    (event: 'changed'): void,
    (event: 'update:modelValue', newValue: boolean): void
    (event: 'confirmed'): void
    (event: 'cancelled'): void
}>()

defineProps<{modelValue?: boolean}>()

const { t, locale } = useI18n()
const loading = ref(false)

const getTranslate  = (locale: LocaleValue) => {
    return t('lang.languages.' + locale)
}

const form = reactive<{lang: LocaleValue}>({
    lang: locale.value as LocaleValue
})

const cancelled = () => {
    emit('cancelled')
    emit('update:modelValue', false)
    form.lang = locale.value as LocaleValue
}

const confirmed = () => {
    emit('confirmed')
    emit('update:modelValue', false)
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
    <AppLoader
    v-if="loading"
    background="rgba(0, 0, 0, 0.5)"
    :text="t('lang.loading', {lang: getTranslate(form.lang)})"
    />

    <ElDialog
    class="modal"
    :model-value="modelValue"
    @update:model-value="(newValue) => emit('update:modelValue', newValue)"
    :title="t('lang.title')"
    @click.stop
    width="fit-content"
    center
    v-bind="$attrs">
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

<style>
.modal {
    border-radius: 15px;
}
</style>