<script setup lang="ts">
import { reactive, shallowRef, type ShallowRef } from 'vue'
import { ElIcon, ElText } from 'element-plus'
import {
    School,
    Collection,
    SwitchButton,
    Histogram,
    User,
    PieChart
} from '@element-plus/icons-vue'

import authService, { Roles } from '@/services/AuthService'
import { useRouter } from 'vue-router'
const router = useRouter()

type MenuItems = {
    name: string
    text: string
    icon: ShallowRef,
    onClick?: () => void
}

const items = reactive<MenuItems[]>([
    {name: 'home', text: 'Statistics', icon: shallowRef(Histogram)},
    {name: 'home', text: 'Account', icon: shallowRef(User)},
    {name: 'home', text: 'Logout', icon: shallowRef(SwitchButton), onClick: () => {
        authService.logout().then(() => {
            router.push({name: 'home'})
        })
    }},
])

import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const checkUserStatus = async () => {
    try {
        let canUserAccess = await authService.hasRole(Roles.ADMIN) || await authService.hasRole(Roles.COWORKER)

        const menuItems =  canUserAccess ? [
            {name: 'library-create', text: 'Add Library', icon: shallowRef(School)},
            {name: 'home', text: 'Update Library', icon: shallowRef(School)},
            {name: 'home', text: 'Remove Library', icon: shallowRef(School)},
            {name: 'add-book', text: 'Add Book', icon: shallowRef(Collection)},
            {name: 'add-book', text: 'Update Book', icon: shallowRef(Collection)},
            {name: 'add-book', text: 'Remove Book', icon: shallowRef(Collection)},
            {name: 'home', text: 'Analytics', icon: shallowRef(PieChart)}
        ] : []

        items.unshift(...menuItems)
    } catch (error) {
        ElMessage({
            message: t('pages.auth.loadFailed'),
            type: 'error'
        })
    }
}
checkUserStatus()
</script>

<template>
    <div class="container-grid">

        <div class="item" v-for="({name, text, icon, onClick}) in items" :key="name">
            <RouterLink :to="{name}" custom v-slot="{navigate}">
                <div class="btn" @click="onClick ? onClick() : navigate()">
                    <ElIcon size="30px" color="green">
                        <component :is='icon'></component>
                    </ElIcon>

                    <ElText tag="p" size="small">{{ text }}</ElText>
                </div>
            </RouterLink>
        </div>

    </div>
</template>

<style scoped lang="scss">
.container-grid {
    margin: .8rem;
    padding: .1rem;
    display: grid;
    gap: 2px;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-auto-rows: minmax(100px, fit-content);

    & .item {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        & .btn {
            width: max-content;
            height: 100%;
            cursor: pointer;
            padding: 5px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;

            min-width: 56px;

            & p {
                text-align: center;
                word-break: keep-all;
            }
        }
    }
}
</style>