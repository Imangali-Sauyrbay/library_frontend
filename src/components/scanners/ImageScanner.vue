<script setup lang="ts">
import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType, type Exception, type Result } from "@zxing/library"
import { ref } from "vue"
import { getBinaryBitmap, getContext } from './utils'

import {
    ElUpload,
    ElIcon,
    ElImage,
type UploadProps,
} from 'element-plus'

import {
    Plus
} from '@element-plus/icons-vue'


const hints = new Map<DecodeHintType, boolean | BarcodeFormat[]>([
    [DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13, BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX]],
    [DecodeHintType.TRY_HARDER, true]
])

const codeReader = new BrowserMultiFormatReader(hints)

const src = ref<string | null>(null)

const emit = defineEmits<{
    (event: 'decode', text: string): void,
    (event: 'decodeStarted'): void,
    (event: 'result', result: Result): void,
    (event: 'error', error: Exception): void,
}>()

const MaxTry = 4

const decode = async (el: HTMLImageElement) => {
    if(!src.value) return

    let tryCount= MaxTry

    let invert = false

    let error: Exception

    const context = getContext(el, true)

    do {
        try {
            const bitmap = getBinaryBitmap(context, invert)
            const result = codeReader.decodeBitmap(bitmap)
            emit('decode', result.getText())
            emit('result', result)
            return
        } catch(e) {
            error = e as Exception
            invert = !invert
            tryCount--
        }
    } while (tryCount >= 0)

    src.value = null
    emit('error', error)
}

const processFile = (e: Event) => {
    if(!src.value) return

    const target = e.target as HTMLImageElement
    emit('decodeStarted')

    setTimeout(() => decode(target), 1500)
}

const onChangeInput: UploadProps['onChange'] = (uploadFile) => {
    src.value = URL.createObjectURL(uploadFile.raw!)
}
</script>

<template>
    <ElUpload v-if="!src" class="uploader"
    accept="image/*"
    :auto-upload="false"
    :show-file-list="false"
    @change="onChangeInput">
        <ElIcon class="uploader-icon">
            <Plus />
        </ElIcon>
    </ElUpload>

    <ElImage v-if="src" class="image" fit="cover" @load="processFile" :src="src" :preview-src-list="[src]" :preview-teleported="true"/>
</template>

<style scoped lang="scss">
.uploader {
    width: 178px;
    height: 178px;
    display: block;
    
    &-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
    }
}
</style>

<style lang="scss">
.uploader {
    & .el-upload {
        border: 2px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);

        &:hover {
            border-color: var(--el-color-primary);
        }
    }
}
</style>