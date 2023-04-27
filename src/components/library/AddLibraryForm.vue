<script setup lang="ts">
import type { geocoders } from 'leaflet-control-geocoder'
import { computed, reactive, ref } from 'vue'

import {
    ElForm,
    ElFormItem,
    ElInput,
    ElInputNumber,
    ElButton,
    ElContainer,
    ElDivider,
    ElNotification,
type FormRules,
type FormInstance
} from 'element-plus'
import LibraryService from '@/services/LibraryService'
import { HttpStatusCode } from 'axios'
import { useRouter } from 'vue-router'

const props = defineProps<{
    result?: geocoders.GeocodingResult
}>()

const isLoading = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
    title: '',
    displayAddress: props.result?.name || '',
    lat: props.result?.center.lat || 0,
    lng: props.result?.center.lng || 0
})

const rules = ref<FormRules>({
    title: {
        min: 3,
        required: true,
        message: 'Min Length 3 char!'
    },

    displayAddress: {
        min: 3,
        required: true,
        message: 'Min Length 3 char!'
    },

    lat: {
        required: true,
        type: 'number',
        message: 'Latitude is required!'
    },

    lng: {
        required: true,
        type: 'number',
        message: 'Longitude is required!'
    }
})

const isCoodrsDisabled = computed(() => {
    return !!props.result?.center.lat && !!props.result?.center.lng
})

const showNotification = (message: string, title: string = '', type: 'error' | 'success' = 'success') => {
    ElNotification({
        message,
        title,
        type,
        showClose: true,
        duration: 5_000
    })
}

const router = useRouter()
const libService = new LibraryService()
const submit = async (formEl: FormInstance | undefined) => {
    if(!formEl) return
    
    await formEl.validate(async (isValid) => {
        if(! isValid) return

        isLoading.value = true
        try{
            const result = await libService.addLibrary({
                displayName: form.displayAddress,
                title: form.title,
                coords: [form.lat, form.lng]
            })

            if(result.status === HttpStatusCode.Created) {
                showNotification('Library is added!', 'Success')
                router.push({name: 'home'})
            }
        } catch (e) {
            console.warn(e)
            showNotification('Error adding!', 'Error', 'error')
        }

        isLoading.value = false
    })
}
</script>

<template>
    <ElContainer class="container">
        <ElForm
        class="form"
        labelPosition="top"
        ref="formRef"
        :model="form"
        :rules="rules">
            <ElFormItem label="Title for Library" prop="title">
                <ElInput v-model="form.title"/>
            </ElFormItem>

            <ElFormItem label="Address Display Name" prop="displayAddress">
                <ElInput type="textarea" v-model="form.displayAddress"/>
            </ElFormItem>
            <ElDivider contentPosition="center">
                Coordinates of library
            </ElDivider>
            <div class="column">
                <ElFormItem label="Address Lattitude" prop="lat">
                    <ElInputNumber
                    :controls="false"
                    :disabled="isCoodrsDisabled"
                    v-model="form.lat"/>
                </ElFormItem>

                <ElFormItem label="Address Longitude" prop="lng">
                    <ElInputNumber
                    :controls="false"
                    :disabled="isCoodrsDisabled"
                    v-model="form.lng"/>
                </ElFormItem>
            </div>
            <ElDivider />
            <ElFormItem>
                <ElButton v-loading="isLoading" class="right" type="primary" @click="submit(formRef)">Submit</ElButton>
            </ElFormItem>
        </ElForm>
    </ElContainer>
</template>

<style scoped>
    .container {
        width: 100%;
        height: 100%;
        justify-content: center;
    }

    .form {
        margin: 20px 5px;
        width: 500px
    }

    .right {
        margin-left: auto;
    }

    .column {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }

    button {
        overflow: hidden
    }
</style>