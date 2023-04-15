<script setup lang="ts">
import { ElIcon } from 'element-plus'
import SoundFullIcon from '@/components/icons/SoundFullIcon.vue'
import SoundMuteIcon from '@/components/icons/SoundMuteIcon.vue'

defineProps<{isOn: boolean}>()

defineEmits<{
    (event: 'clicked'): void
}>()
</script>

<template>
    <div class="sound" @click.stop="$emit('clicked')">
        <el-icon color="white">
            <SoundFullIcon v-if="isOn"/>
            <SoundMuteIcon v-else/>
        </el-icon>
    </div>
</template>

<style scoped lang="scss">
@import '@/main.scss';

.sound {
    position: absolute;
    top: -2px;
    left: -2px;
    width: 50px;
    height: 40px;

    border: 2px solid rgba(255, 255, 255, 0.5);
    border-bottom-right-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all .5s ease-in-out;
    font-size: 30px;

    
    @include breakpoint('xxxs') {
        opacity: 1;
    }

    @include breakpoint('xxs') {
        opacity: 0.7;
    }

    @include breakpoint('sm') {
        opacity: 0.4;
    }

    &:hover, &:active, &:focus {
        opacity: 1;
    }
}

.sound > i {
    font-size: inherit;
}

.closed .sound {
    display: none
}

.transition-active .sound {
    opacity: 0;
    display: flex;
}


@include breakpoint('xl') {
    .sound {
        width: 70px;
        height: 50px;
        font-size: 40px;
    }
}

@include breakpoint('xxl') {
    .sound {
        width: 100px;
        height: 70px;
        font-size: 46px;
    }
}
</style>