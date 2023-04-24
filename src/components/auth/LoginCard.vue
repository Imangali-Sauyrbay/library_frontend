<script setup lang="ts">
import AppDraggable from '@/components/AppDraggable.vue'
import AppCardForm from '@/components/app-card/AppCardForm.vue'

import { onMounted, reactive, ref, type ComponentPublicInstance } from 'vue'
import { ElFormItem, ElInput, ElButton, ElForm, type FormRules, type FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const childCard = ref<{card: ComponentPublicInstance}>()
const cardBody = ref<HTMLElement>()

const formEl = ref<FormInstance>()

const form = reactive({
    email: '',
    password: '',
})

const rules = reactive<FormRules>({
    email: [
        {
            required: true,
            type: 'email',
            message: t('validation.invalidEmail'),
            trigger: 'blur'
        }
    ],

    password: [
        {
            required: true,
            type: 'string',
            min: 8,
            message: t('validation.minLength', {field: 'Password', n: 8})
        }
    ]
})

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate((isValid) => {
        if (!isValid) return
        alert('ok')
    })
}

onMounted(() => {
   cardBody.value = childCard.value?.card.$el.firstElementChild
})
</script>

<template>
    <AppDraggable :target="cardBody">
        <AppCardForm ref="childCard">
            <ElForm
            status-icon
            label-position="top"
            ref="formEl"
            :model="form"
            :rules="rules">
                <div class="form_items">
                    <el-form-item :label="t('pages.auth.email')" prop="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('pages.auth.password')" prop="password">
                        <el-input v-model="form.password" type="password"></el-input>
                    </el-form-item>
                </div>
                <div class="right">
                    <i18n-t scope="global" tag="span" keypath="app.redirects.toRegistration">
                        <template #login>
                            <RouterLink :to="{name: 'register'}" v-slot="{navigate}" custom>
                                <el-button link @click="navigate" type="primary">{{ t('app.redirects.register') }}</el-button>
                            </RouterLink>
                        </template>
                    </i18n-t>

                    <el-button type="primary" @click="onSubmit(formEl)">{{ t('pages.auth.login') }}</el-button>
                </div>
            </ElForm>
        </AppCardForm>
    </AppDraggable>
</template>

<style scoped lang="sass">
.form_items
    position: relative
    max-height: 300px
    overflow-y: scroll
    touch-action: auto

.right
    display: flex
    flex-direction: column-reverse
    align-items: center
    justify-content: center
    margin-bottom: 14px
    & span
        margin-top: 1rem
        display: flex
        align-items: baseline

</style>