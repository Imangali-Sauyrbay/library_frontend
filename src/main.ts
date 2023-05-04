import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

import './assets/main.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { ElLoading, ElInfiniteScroll } from 'element-plus'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(ElLoading)
app.use(ElInfiniteScroll)

app.mount('#app')
