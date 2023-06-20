<script setup lang="ts">
import AuthLayout from '@/components/layouts/AuthLayout.vue'
import FillUnfilledFieldsModal from '@/components/auth/FillUnfilledFieldsModal.vue'
import { useRoute, onBeforeRouteUpdate, type RouteLocationNormalized } from 'vue-router'
import { ref } from 'vue'


export type ToFill = { unfilled_fields?: ([string, string])[]}
const route = useRoute()

const fields = ref<([string, string])[]>([])
const fillFields = (to: RouteLocationNormalized) => {
    fields.value = (to.meta.to_fill as ToFill)?.unfilled_fields || []
}

fillFields(route)
onBeforeRouteUpdate(fillFields)
</script>

<template>
    <AuthLayout>
        <FillUnfilledFieldsModal :fields="fields" @clear="fields.length = 0"/>
        <RouterView />
    </AuthLayout>
</template>
