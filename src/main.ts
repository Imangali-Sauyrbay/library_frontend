import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

import './assets/main.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { ElLoading } from 'element-plus'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.directive('loading', ElLoading.directive)

app.mount('#app')
