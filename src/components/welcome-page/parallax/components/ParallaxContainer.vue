<script lang="ts" setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElNotification } from 'element-plus'
import 'element-plus/es/components/notification/style/css'
import { random } from '@/utils/Random';
import useMobileDevice from '@/hooks/useMobileDevice';

const { t } = useI18n()
const { isMobile } = useMobileDevice()

onMounted(() => {
    const mobile = isMobile()
    const key = 'isShowedWelcomePageNotification'

    const chance = mobile ? 80 : 30
    const number = random(0, 100)

    if (number > chance || localStorage.getItem(key)) return

    ElNotification({
        title: t('pages.welcome.notifications.info'),
        message: t('pages.welcome.notifications.infoText'),
        type: 'info',
        duration: random(4000, 7000)
    })

    localStorage.setItem(key, 'true')
})
</script>

<template>
    <div class="parallax-container">
        <slot></slot>
    </div>
</template>

<style scoped>
.parallax-container {
    position: absolute;
    overflow: hidden;
    display: table;
    left: 0;
    top: 0;
}
</style>