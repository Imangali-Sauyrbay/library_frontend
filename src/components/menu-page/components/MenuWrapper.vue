<script setup lang="ts">
import { shallowRef } from 'vue'
import { ElIcon, ElText } from 'element-plus'
import { School } from '@element-plus/icons-vue'

const items = [
    {name: 'library-create', text: 'Add Library', icon: shallowRef(School)},
    {name: 'home', text: 'Libfsdf fdsdfsf', icon: shallowRef(School)},
    {name: 'home', text: 'Libsdfsdfsd ', icon: shallowRef(School)},
    {name: 'home', text: 'Lifb', icon: shallowRef(School)},
    {name: 'home', text: 'Lisdf b', icon: shallowRef(School)},
    {name: 'home', text: 'Lisdfsdb', icon: shallowRef(School)},
    {name: 'home', text: 'Libfsd', icon: shallowRef(School)},
    {name: 'home', text: 'Lib', icon: shallowRef(School)},
    {name: 'home', text: 'Lib', icon: shallowRef(School)},
    {name: 'home', text: 'Lib', icon: shallowRef(School)},
    {name: 'home', text: 'Lib', icon: shallowRef(School)},
    {name: 'home', text: 'Lib', icon: shallowRef(School)},
    {name: 'home', text: 'Lib', icon: shallowRef(School)},
    {name: 'home', text: 'Lib', icon: shallowRef(School)},
    {name: 'home', text: 'Lib', icon: shallowRef(School)},
    {name: 'home', text: 'Lib', icon: shallowRef(School)},
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