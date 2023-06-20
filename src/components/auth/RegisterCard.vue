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
    confirmPassword: ''
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
    ],

    confirmPassword: [
        {
            required: true,
            type: 'string',
            message: t('validation.passwordNotMatch'),
            validator: (rule, value, cb) => {
                if(value !== form.password) {
                   return cb(new Error())
                }

                cb()
            }
        },
        {
            required: true,
            type: 'string',
            min: 8,
            message: t('validation.minLength', {field: 'Password', n: 8})
        }
    ]
})

import authService from '@/services/AuthService'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const uuid = Array.isArray(route.params?.uuid) ? route.params?.uuid[0] : route.params?.uuid

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate(async (isValid) => {
        if (!isValid) return
        
        const res = await authService.register(
            form.email,
            form.password,
            form.confirmPassword,
            uuid
        )

        console.log(res);
        router.push({name: 'home'})
    })
}

import regLinkService from '@/services/RegLinkService'
const title = ref('pages.auth.RegisterUser')
let paramsToTranslate: Record<string, string> = {};

onMounted(() => {
    cardBody.value = childCard.value?.card.$el.firstElementChild
    regLinkService.getLink(uuid)
    .then(res => {
        if(res.data.use_count <= 0) {
            return router.replace({name: 'register'})
        }

        switch(res.data.role?.name) {
            case 'coworker':
                title.value = 'pages.auth.RegisterCoworker'
                paramsToTranslate['library'] = res.data.library?.title || ''
                break;
            case 'student':
                title.value = 'pages.auth.RegisterStudent'
                break;
            case 'admin':
                title.value = 'pages.auth.RegisterAdmin'
        }
    })
    .catch(() => {
        router.replace({name: 'register'})
    })
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
            <h3 style="margin-bottom: 1rem; color: var(--el-text-color-regular);">{{t(title, paramsToTranslate)}}</h3>
                <div class="form_items">
                    <el-form-item :label="t('pages.auth.email')" prop="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item> 
                    <el-form-item :label="t('pages.auth.password')" prop="password">
                        <el-input v-model="form.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('pages.auth.confirmPassword')" prop="confirmPassword">
                        <el-input v-model="form.confirmPassword" type="password"></el-input>
                    </el-form-item>
                </div>
                <div class="right">
                    <i18n-t scope="global" tag="span" keypath="app.redirects.toLogin">
                        <template #login>
                            <RouterLink :to="{name: 'login'}" v-slot="{navigate}" custom>
                                <el-button link @click="navigate" type="primary">{{ t('app.redirects.login') }}</el-button>
                            </RouterLink>
                        </template>
                    </i18n-t>
                    
                    <el-button type="primary" @click="onSubmit(formEl)">{{ t('pages.auth.register') }}</el-button>
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