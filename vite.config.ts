import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   https: {
  //     key: resolve(dirname(fileURLToPath(import.meta.url)), './192.168.1.7-key.pem'),
  //     cert: resolve(dirname(fileURLToPath(import.meta.url)), './192.168.1.7.pem'),
  //   }
  // },
  plugins: [
    vue(),
    ElementPlus({}),
    VueI18nPlugin({
      allowDynamic: true,
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
    }),
    mkcert({hosts: ['localhost', '192.168.0.0']})
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url))
    },
    extensions: ['.js', '.vue']
  }
})
