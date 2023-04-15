<template>
    <div class="background">
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
@import "@/main.scss";

.background {
    background-image: url(@/assets/welcome-parallax/ukgu_sky.jpg);
    background-size: cover;
    position: absolute;
    bottom: -10%;
    width: 120%;
    left: -10%;
    top: -10%;
}
</style>