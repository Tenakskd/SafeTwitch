import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/index.css'
import i18n from './i18n'

const app = createApp(App)

// Add protocol variable
// For some reason, import.meta.env.VITE_HTTPS === "true"
// returns false, even if it is true.
// Making a copy of the variable seems to work
const https = import.meta.env.SAFETWITCH_HTTPS.slice() === 'true'

const protocol = https ? 'https://' : 'http://'
const wsProtocol = https ? 'wss://' : 'ws://'
app.provide('protocol', protocol)
app.provide('rootUrl', `${protocol}${import.meta.env.SAFETWITCH_INSTANCE_DOMAIN}`)
app.provide('rootBackendUrl', `${protocol}${import.meta.env.SAFETWITCH_BACKEND_DOMAIN}`)
app.provide('wsLink', `${wsProtocol}${import.meta.env.SAFETWITCH_BACKEND_DOMAIN}`)

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  IoSearchOutline,
  BiHeadphones,
  BiCameraVideoFill,
  BiLink45Deg,
  FaCircleNotch,
  BiTwitter,
  BiInstagram,
  BiDiscord,
  BiYoutube,
  BiTiktok,
  BiReddit,
  BiHeartFill,
  FaShareAlt,
  IoCloseSharp,
  MdDownloadRound,
  IoPerson,
  FaExpand
} from 'oh-vue-icons/icons'

addIcons(
  IoSearchOutline,
  BiHeadphones,
  BiCameraVideoFill,
  BiLink45Deg,
  FaCircleNotch,
  BiTwitter,
  BiInstagram,
  BiDiscord,
  BiYoutube,
  BiTiktok,
  BiReddit,
  BiHeartFill,
  FaShareAlt,
  IoCloseSharp,
  MdDownloadRound,
  IoPerson,
  FaExpand
)

app.component('v-icon', OhVueIcon)
app.use(router)
app.use(i18n)
app.mount('#app')
