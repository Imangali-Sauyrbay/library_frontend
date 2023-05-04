<script lang="ts" setup>
import {
    ElContainer as Container,
    ElMain as Main,
    ElButton as Button
} from 'element-plus'
import {
Moon,
Sunny
} from '@element-plus/icons-vue'
import { toggleDark, isDark } from '@/composables/darkMode'

import { ref } from 'vue'
import LanguageIcon from '@/components/icons/LanguageIcon.vue'
import AppLangChangeDialog from '@/components/AppLangChangeDialog.vue'

const dialogVisible = ref(false)
</script>

<template>
    <div class="guest-layout">
        <div class="wave"></div>
        <Container class="container">
            <Main class="main">
               <slot />
            </Main>
        </Container>
        <AppLangChangeDialog v-model="dialogVisible"/>
        <Button
            class="darkmode-toggle"
            :icon="isDark ? Sunny : Moon"
            circle
            @click="() => toggleDark()"
        >
        </Button>

        <Button
            class="change-lang"
            :icon="LanguageIcon"
            circle
            @click="dialogVisible = true"
        ></Button>
    </div>
</template>
  
<style scoped lang="scss">
.guest-layout {
    position: relative;
    height: 100%;
    background-color: rgb(221, 221, 221);
    transition: background-color .5s ease-in-out;
}

.dark .guest-layout {
    background-color: rgb(46, 46, 46);
}

.container {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 2;
}

.main {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}

.dark .main::before {
    box-shadow: inset 0 0 20px 2px #d662df;
}

.main::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    pointer-events: none;
    transition: all .5s ease-in-out;
}

.darkmode-toggle, .change-lang {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  width: 4vw;
  height: 4vw;
  min-width: 3rem;
  min-height: 3rem;
  max-width: 5rem;
  max-height: 5rem;
  font-size: 26px;
  transition: all .3s ease-in-out;

  &:hover {
    transform: scale(1.1)
  }

  &:active {
    transform: scale(.9)
  }
}

.change-lang {
    right: 5rem;
}

.wave {
    position: absolute;
    bottom: 0;
    left: 0;
    top: 0;
    right: 0;
    background-image: url('@/assets/layered-waves.svg');
    background-repeat: no-repeat;
    background-size: cover;
    z-index: 1;
    transition: all .5s ease-in-out;
    filter: brightness(1.5);
}

.dark .wave {
    filter: brightness(0.7);
}
</style>
