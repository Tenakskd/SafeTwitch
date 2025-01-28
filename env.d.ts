/// <reference types="vite/client" />

// https://github.com/intlify/vue-i18n-next/issues/1403
/// <reference types="vite/client" /> 
/// <reference path="node_modules/vue-i18n/dist/vue-i18n.d.ts" />
declare module 'vue-i18n'

interface ImportMetaEnv {
    readonly SAFETWITCH_BACKEND_DOMAIN: string
    readonly SAFETWITCH_INSTANCE_DOMAIN: string
    readonly SAFETWITCH_HTTPS: string
    readonly SAFETWITCH_DEFAULT_LOCALE: string
    readonly SAFETWITCH_FALLBACK_LOCALE: string
    readonly SAFETWITCH_COMMIT_HASH: string
    readonly SAFETWITCH_TAG: string
    readonly SAFETWITCH_DEFAULT_THEME: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }