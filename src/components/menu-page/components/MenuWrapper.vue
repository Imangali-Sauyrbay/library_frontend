<script setup lang="ts">
import { shallowRef } from 'vue'
import { ElIcon, ElText } from 'element-plus'
import {
    School,
    Collection,
    SwitchButton,
    Histogram,
    User,
    PieChart
} from '@element-plus/icons-vue'

const items = [
    {name: 'library-create', text: 'Add Library', icon: shallowRef(School)},
    {name: 'home', text: 'Update Library', icon: shallowRef(School)},
    {name: 'home', text: 'Remove Library', icon: shallowRef(School)},
    {name: 'add-book', text: 'Add Book', icon: shallowRef(Collection)},
    {name: 'add-book', text: 'Update Book', icon: shallowRef(Collection)},
    {name: 'add-book', text: 'Remove Book', icon: shallowRef(Collection)},

    {name: 'home', text: 'Analytics', icon: shallowRef(PieChart)},
    {name: 'home', text: 'Statistics', icon: shallowRef(Histogram)},
    {name: 'home', text: 'Account', icon: shallowRef(User)},
    {name: 'home', text: 'Logout', icon: shallowRef(SwitchButton)},
]
</script>

<template>
    <div class="container-grid">

        <div class="item" v-for="({name, text, icon}) in items" :key="name">
            <RouterLink :to="{name}" custom v-slot="{navigate}">
                <div class="btn" @click="navigate">
                    <ElIcon size="30px" color="green">
                        <component :is='icon.value'></component>
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