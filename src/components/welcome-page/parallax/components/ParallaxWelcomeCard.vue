<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import ParallaxCard from './ParallaxCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <ParallaxCard>
        <h1 class="welcome-title">
            {{ t('pages.welcome.card.title') }}
        </h1>
        <p class="welcome-text">
            {{ t('pages.welcome.card.text') }}
        </p>

        <i18n-t keypath="pages.welcome.card.info" tag="p" class="welcome-links" scope="global">
            <template #register>
                <RouterLink :to="{name: 'register'}">
                    {{ t('pages.welcome.card.register') }}
                </RouterLink>
            </template>

            <template #login>
                <RouterLink :to="{name: 'login'}">
                    {{ t('pages.welcome.card.login') }}
                </RouterLink>
            </template>
        </i18n-t>
    </ParallaxCard>
</template>

<style lang="scss" scoped>
@import '@/main.scss';

.welcome-text{
    font-size: 1.4rem;
    text-shadow: 0px 0px 15px #8a8a8a;
}

.welcome-links {
    font-size: 1.2rem;
    text-shadow: 0px 0px 15px #8a8a8a;
}

.welcome-title,
.welcome-links {
    text-shadow: 0px 0px 15px #8a8a8a;
}

@include breakpoint('xxxs') {
    .welcome-title{
        font-size: 20px;
    }
    .welcome-text{
        font-size: 16px;
    }

    .welcome-links {
        font-size: 14px;
    }
}

@include breakpoint('xxs') {
    .welcome-title{
        font-size: 20px;
    }
    .welcome-text{
        font-size: 16px;
    }

    .welcome-links {
        font-size: 14px;
    }
}

@include breakpoint('xs') {
    .welcome-text{
        font-size: 18px;
    }

    .welcome-links {
        font-size: 16px;
    }
}


@include breakpoint('md') {
    .welcome-title{
        font-size: 24px;
    }
    .welcome-text{
        font-size: 20px;
    }

    .welcome-links {
        font-size: 18px;
    }
}

@include breakpoint('lg') {
    .welcome-title {
        font-size: 30px;
    }
}

@include breakpoint('xl') {
    .welcome-title {
        font-size: 34px;
    }
    .welcome-text{
        font-size: 30px;
    }

    .welcome-links { 
        font-size: 26px;
    }
}

@include breakpoint('xxl') {
    .welcome-title {
        font-size: 54px;
    }
    .welcome-text{
        font-size: 48px;
    }

    .welcome-links {
        font-size: 38px;
    }
}
</style>
