import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { dirname, resolve } from 'node:path'
import { gitDescribeSync } from 'git-describe'
import VueDevTools from 'vite-plugin-vue-devtools'


// Footer version
const gitVer = gitDescribeSync()
process.env.SAFETWITCH_COMMIT_HASH = gitVer.hash
process.env.SAFETWITCH_TAG = gitVer.tag!


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
    }),
    VueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
  envPrefix: 'SAFETWITCH_',
})

