<script setup lang="ts">
import GuestLayout from '@/components/layouts/GuestLayout.vue'
import AppDraggable from '@/components/AppDraggable.vue'
import AppCardWrapper from '@/components/app-card/AppCardWrapper.vue'
import AppCard from '@/components/app-card/AppCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <GuestLayout>
        <AppDraggable>
            <AppCardWrapper>
                <AppCard style="padding-bottom: 3rem;">
                    <h1>{{ t('app.errors.notFound') }}</h1>
                    <code>404!</code>
                    <p>{{ t('app.errors.notFoundDesc') }}</p>
                </AppCard>
            </AppCardWrapper>
        </AppDraggable>
    </GuestLayout>
</template>