<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import UserOrder from '@/components/AppOrderMake.vue'
import WorkerOrder from '@/components/AppOrderConsume.vue'
import { ElMessage } from 'element-plus'

const isUserWorker = ref(false)
const { t } = useI18n()

import authService, { Roles } from '@/services/AuthService'

onBeforeMount(async () => {
    try {
        isUserWorker.value = await authService.hasRole(Roles.COWORKER)
    } catch (error) {
        ElMessage({
            message: t('pages.auth.loadFailed'),
            type: 'error'
        })
    }
})
</script>

<template>
    <WorkerOrder v-if="isUserWorker"/>
    <UserOrder v-else/>
</template>
