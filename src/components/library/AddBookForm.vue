<script setup lang="ts">
import { ref } from 'vue'

import {
    ElForm,
    ElFormItem,
    ElInput,
    ElInputNumber,
    ElButton,
    ElContainer,
    ElDivider,
    ElNotification,
    ElSelectV2,
    ElUpload,
    type FormRules,
    type FormInstance,
type UploadProps,
type UploadInstance,
type UploadRawFile,
genFileId
} from 'element-plus'

import { useAddBookStore } from '@/stores/addBook'
import { useRouter } from 'vue-router'

const {form, getLibraries, reset, send} = useAddBookStore()

const isLoading = ref(false)
const isSelectLoading = ref(false)
const formRef = ref<FormInstance>()

const rules = ref<FormRules>({
    title: {
        type: 'string',
        min: 3,
        required: true,
        message: 'Min Length 3 char!'
    },

    description: {
        type: 'string',
        min: 3,
        required: true,
        message: 'Min Length 3 char!'
    },

    authors: {
        type: 'string',
        min: 3,
        required: true,
        message: 'Min Length 3 char!'
    },

    identifier: {
        type: 'string',
        required: true,
    },

    quantity: {
        type: 'number',
        required: true,
    },

    librarySlug: {
        type: 'string',
        min: 3,
        required: true,
        message: 'Min Length 3 char!'
    },

    coverPage: {
        type: 'number',
    },

    pdf: {
        type: 'object',
        validator(rule, value, callback) {
            if(!form.cover && !form.pdf) {
                return callback(new Error('Choose one of them!'))
            }

            callback()
        },
    },

    cover: {
        type: 'object',
        validator(rule, value, callback) {
            if(!form.cover && !form.pdf) {
                return callback(new Error('Choose one of them!'))
            }

            callback()
        },
    }
})

const uploadImage = ref<UploadInstance>()
const uploadBook = ref<UploadInstance>()

interface ListItem {
    value: string,
    label: string
}

const options = ref<ListItem[]>([])

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
            await send(console.log)
            reset()
            showNotification('Successful!', 'Success', 'success')
            router.push({name: 'home'})
        } catch (e) {
            console.warn(e)
            showNotification('Error adding!', 'Error', 'error')
        }

        isLoading.value = false
    })
}

type Responce = {
    data: {
        data: ({title: string, displayAddress: string, slug: string})[]
    }
}

const loadLibrary = async (query: string) => {
    isSelectLoading.value = true

    try {
        const res: Responce = await getLibraries(query)

        options.value = res.data.data.map(lib => {
            const option: ListItem = {
                value: lib.slug,
                label: lib.title + '\n' + lib.displayAddress
            }

            return option
        })
    } catch(e) {
        console.warn(e)
    }

    isSelectLoading.value = false
}

const onChangeCover: UploadProps['onChange'] = (uploadFile) => {
    form.cover = uploadFile.raw
}

const onChangeBook: UploadProps['onChange'] = (uploadFile) => {
    form.pdf = uploadFile.raw
}

const onExceedCover: UploadProps['onExceed'] = (files) => {
    uploadImage.value?.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadImage.value?.handleStart(file)
}

const onExceedBook: UploadProps['onExceed'] = (files) => {
    uploadBook.value?.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadBook.value?.handleStart(file)
}
</script>

<template>
    <ElContainer class="container">
        <ElForm
        class="form"
        labelPosition="top"
        ref="formRef"
        :model="form"
        :rules="rules"
        >
            <ElFormItem label="Title" prop="title">
                <ElInput v-model="form.title"/>
            </ElFormItem>

            <ElFormItem label="Authors" prop="authors">
                <ElInput v-model="form.authors"/>
            </ElFormItem>

            <ElFormItem label="Description" prop="description">
                <ElInput type="textarea" v-model="form.description"/>
            </ElFormItem>


            <ElFormItem label="Quantity" prop="quantity">
                <ElInputNumber :min="1" :controls="false" v-model="form.quantity"/>
            </ElFormItem>

            <ElFormItem label="ISBN or Custom identifier" prop="quantity">
                <ElInput v-model="form.identifier"/>
            </ElFormItem>

            <ElFormItem label="Select Library" prop="librarySlug">
                <ElSelectV2
                v-model="form.librarySlug"
                remote
                filterable
                style="width: 100%;"
                size="large"
                placeholder="Select a library!"
                :remoteMethod="loadLibrary"
                :loading="isSelectLoading"
                :options="options"
                />
            </ElFormItem>

            <ElDivider content-position="center">One of two, Both if you want so!</ElDivider>

                <ElFormItem label="Cover" prop="cover">
                    <ElUpload
                        accept="image/*"
                        ref="uploadImage"
                        :auto-upload="false"
                        :limit="1"
                        @change="onChangeCover"
                        @exceed="onExceedCover">
                        <template #trigger>
                                <ElButton type="primary">Select Cover</ElButton>
                        </template>
                    </ElUpload>
                </ElFormItem>

                <div class="column">
                    <ElFormItem label="PDF book" prop="pdf">
                        <ElUpload
                            accept="application/pdf"
                            ref="uploadBook"
                            :auto-upload="false"
                            :limit="1"
                            @change="onChangeBook"
                            @exceed="onExceedBook">
                            <template #trigger>
                                    <ElButton type="primary">Select Book</ElButton>
                            </template>
                        </ElUpload>
                    </ElFormItem>

                    <ElFormItem label="Page number that will be cover" prop="coverPage">
                        <ElInputNumber :min="1" :controls="false" v-model="form.coverPage"/>
                    </ElFormItem>
                </div>

            <ElDivider/>

            <ElFormItem>
                <ElButton v-loading="isLoading" class="right" type="primary" @click="submit(formRef)">Submit</ElButton>
            </ElFormItem>
        </ElForm>
    </ElContainer>
</template>

<style scoped>
    .container {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        justify-content: center;
        padding: 3rem 1rem;
        overflow-x: scroll;
    }

    .form {
        margin: 20px 5px;
        width: 500px;
        height: fit-content;
    }

    .right {
        margin-left: auto;
    }

    .column {
        display: flex;
        justify-content: flex-start;
        gap: 2rem;
        align-items: flex-start;
    }

    button {
        overflow: hidden
    }
</style>