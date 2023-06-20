<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
    ElDialog,
    ElButton,
    ElForm,
    ElFormItem,
    ElInput,
    ElMessage,
    ElNotification,
    ElDatePicker
} from 'element-plus'
import { useI18n } from 'vue-i18n';

const props = defineProps<{fields: ([string, string])[]}>()

const emit = defineEmits<{
  (event: 'clear'): void
}>()

const { t } = useI18n()

const stringableTypes = [
    'string',
    'char',
    'character',
    'character varying',
    'varchar',
    'citext',
    'name',
    'bpchar',
    'uuid',
    'text'
]

const numberableTypes = [
    'integer',
    'int',
    'bigint',
    'numeric',
    'decimal',
    'real',
    'float4',
    'double precision',
    'float8',
    'float',
    'double'
]

const yearRequired = [
    'admission_at',
    'graduation_at'
]

const isString = (type: string) => stringableTypes.includes(type)
const isNumeric = (type: string) => numberableTypes.includes(type)

const form = reactive<{[key: string]: any}>({})

props.fields.forEach(([name, type]) => {
    if(isNumeric(type)) {
        form[name] = 0
    }

    if(isString(type)) {
        form[name] = ''
    }
})

const isLoading = ref(false)

import authService from '@/services/AuthService'
import type { AxiosError } from 'axios';

const submit = async () => {
    try {
        isLoading.value = true
        const res = await authService.fill({...form})

        const ok = res.status <= 299 && res.status >= 200

        if(ok) {
            emit('clear')
            ElMessage({
                type: 'success',
                message: t('app.messages.success')
            })
        } else {
            ElMessage({
                type: 'warning',
                message: t('app.messages.tryLater')
            })
        }
    } catch (e) {
        const error = e as AxiosError

        if(error.response?.status !== 422) {
            const message = error.response?.status === 429 ? 'app.errors.toManyRequests' : 'app.errors.notFilled'
            ElMessage({
                type: 'error',
                message: t(message)
            })
        }
        
        if(error.response?.status === 422) {
            const data = error.response.data as {errors: {[key: string]: string[]}}
            Object.keys(data.errors).forEach(key => {
                data.errors[key].forEach(format => {
                    ElNotification({
                        type: 'error',
                        title: t('app.messages.error'),
                        message: t('app.errors.validationError', {
                            field: t(key),
                            format: t(`app.response.formats.${format}`)
                    }),
                })
                })
            })
        }
    }

    isLoading.value = false
}
</script>

<template>
    <el-dialog
        :model-value="props.fields.length > 0"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :title="t('pages.auth.fill')"
    >
        <el-form :model="form" label-width="120px">
            <template v-for="[field, type] in fields" :key="`${field}_${type}`">
                <el-form-item v-if="isString(type)" :label="t(field)">
                    <el-input v-model="form[field]" />
                </el-form-item>

                <el-form-item v-else-if="yearRequired.includes(field)" :label="t(field)">
                    <el-date-picker
                        v-model="form[field]"
                        type="year"
                        value-format="YYYY"
                        :placeholder="t('app.time.select.date')"
                    />
                </el-form-item>
            </template>
        </el-form>

        <template #footer>
        <span class="dialog-footer">
            <el-button type="primary" @click="submit" :loading="isLoading">
            {{ t('app.actions.submit') }}
            </el-button>
        </span>
        </template>
    </el-dialog>
</template>

<style scoped>

</style>