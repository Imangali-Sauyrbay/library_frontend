<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

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

import { HttpStatusCode } from 'axios'
import { useRouter } from 'vue-router'
import type { NomitnatimResponce } from '../types'
import { useLibraryFormStore } from '@/stores/libraryFormStore'

const props = defineProps<{
    result?: NomitnatimResponce
}>()

const isLoading = ref(false)
const formRef = ref<FormInstance>()

const { reset, send, form, set } = useLibraryFormStore()

const rules = ref<FormRules>({
    title: {
        min: 3,
        required: true,
        message: 'Min Length 3 char!'
    },

    displayName: {
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

const submit = async (formEl: FormInstance | undefined) => {
    if(!formEl) return
    
    await formEl.validate(async (isValid) => {
        if(! isValid) return

        isLoading.value = true
        try{
            const result = await send()
            
            if(result.status === HttpStatusCode.Created) {
                showNotification('Library is added!', 'Success')
                reset()
                router.push({name: 'home'})
            } else {
                showNotification('Send Successfull, but server send wrong code!', 'Success')
            }

        } catch (e) {
            console.warn(e)
            showNotification('Error adding!', 'Error', 'error')
        }

        isLoading.value = false
    })
}

onMounted(() => {
    if(props.result) {
        set(props.result)
    }
})
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

            <ElFormItem label="Address Display Name" prop="address.displayName">
                <ElInput type="textarea" v-model="form.address.displayName"/>
            </ElFormItem>

            <ElDivider contentPosition="center">
                Coordinates of library
            </ElDivider>
            <div class="column">
                <ElFormItem label="Address Lattitude" prop="address.lat">
                    <ElInputNumber
                    :controls="false"
                    :disabled="isCoodrsDisabled"
                    v-model="form.address.lat"/>
                </ElFormItem>

                <ElFormItem label="Address Longitude" prop="address.lng">
                    <ElInputNumber
                    :controls="false"
                    :disabled="isCoodrsDisabled"
                    v-model="form.address.lng"/>
                </ElFormItem>
            </div>
            <ElDivider />

            <ElFormItem>
                <ElButton v-loading="isLoading" class="right" type="primary" @click="submit(formRef)">Submit</ElButton>
            </ElFormItem>

            <ElDivider contentPosition="center">
                Additional data
            </ElDivider>

            <div>
                <ElFormItem label="Amenity">
                    <ElInput v-model="form.address.amenity"/>
                </ElFormItem>

                <ElFormItem label="aeroway">
                    <ElInput v-model="form.address.aeroway"/>
                </ElFormItem>

                <ElFormItem label="Railway">
                    <ElInput v-model="form.address.railway"/>
                </ElFormItem>

                <ElFormItem label="Road">
                    <ElInput v-model="form.address.road"/>
                </ElFormItem>

                <ElFormItem label="Building">
                    <ElInput v-model="form.address.building"/>
                </ElFormItem>

                <ElFormItem label="House number">
                    <ElInput v-model="form.address.house_number"/>
                </ElFormItem>

                <ElFormItem label="Landuse">
                    <ElInput v-model="form.address.landuse"/>
                </ElFormItem>

                <ElFormItem label="Municipality">
                    <ElInput v-model="form.address.municipality"/>
                </ElFormItem>

                <ElFormItem label="Neighbourhood">
                    <ElInput v-model="form.address.neighbourhood"/>
                </ElFormItem>

                <ElFormItem label="City district">
                    <ElInput v-model="form.address.city_district"/>
                </ElFormItem>

                <ElFormItem label="City">
                    <ElInput v-model="form.address.city"/>
                </ElFormItem>

                <ElFormItem label="Hamlet">
                    <ElInput v-model="form.address.hamlet"/>
                </ElFormItem>

                <ElFormItem label="Village">
                    <ElInput v-model="form.address.village"/>
                </ElFormItem>

                <ElFormItem label="Town">
                    <ElInput v-model="form.address.town"/>
                </ElFormItem>

                <ElFormItem label="County">
                    <ElInput v-model="form.address.county"/>
                </ElFormItem>

                <ElFormItem label="Suburb">
                    <ElInput v-model="form.address.suburb"/>
                </ElFormItem>

                <ElFormItem label="State">
                    <ElInput v-model="form.address.state"/>
                </ElFormItem>

                <ElFormItem label="State district">
                    <ElInput v-model="form.address.state_district"/>
                </ElFormItem>

                <ElFormItem label="Postcode">
                    <ElInput v-model="form.address.postcode"/>
                </ElFormItem>

                <ElFormItem label="ISO3166-2-lvl4">
                    <ElInput v-model="form.address['ISO3166-2-lvl4']"/>
                </ElFormItem>

                <ElFormItem label="Country">
                    <ElInput v-model="form.address.country"/>
                </ElFormItem>

                <ElFormItem label="Country code">
                    <ElInput v-model="form.address.country_code"/>
                </ElFormItem>
            </div>
        </ElForm>
    </ElContainer>
</template>

<style scoped>
    .container {
        width: 100%;
        height: 100%;
        max-height: 100%;
        justify-content: center;
        overflow-y: scroll;
    }

    .form {
        margin: 20px 5px;
        width: 100%;
        max-width: 500px;
        height: fit-content;
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