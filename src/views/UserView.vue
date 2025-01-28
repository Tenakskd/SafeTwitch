<script lang="ts">
import { ref, inject } from 'vue'
import { useRoute } from 'vue-router'

import VideoPlayer from '@/components/VideoPlayer.vue'
import TwitchChat from '@/components/TwitchChat.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import FollowButton from '@/components/FollowButton.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import VideoTab from '@/components/user/VideoTab.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import AboutTab from '@/components/user/AboutTab.vue'
import ShareModal from '@/components/popups/ShareButtonModal.vue'
import VueTitle from '@/components/VueTitle.vue'
import ActionButtons from '@/components/ActionButtons.vue'

import type { StreamerData } from '@/types'
import { truncate, abbreviate, getEndpoint } from '@/mixins'
import { getSetting } from '@/settingsManager'

export default {
  inject: ['rootBackendUrl'],
  async setup() {
    const route = useRoute()
    const username = route.params.username
    const data = ref<StreamerData>()
    const status = ref<'ok' | 'error'>()
    const rootBackendUrl = inject('rootBackendUrl')
    const isTheatreMode = ref(false)
    const videoOptions = {
      autoplay: getSetting('autoplay'),
      controls: true,
      sources: [
        {
          src: `${rootBackendUrl}/proxy/stream/${username}/hls.m3u8?withAudioOnly=false`,
          type: 'application/vnd.apple.mpegurl'
        }
      ],
      fluid: true
    }
    const audioOptions = `${rootBackendUrl}/proxy/stream/${username}/hls.m3u8`

    return {
      data,
      status,
      videoOptions,
      audioOptions,
      shareModalVisible: ref(false),
      isTheatreMode
    }
  },
  async mounted() {
    // check if audio only
    const audioOnly = getSetting('audioOnly')
    if (audioOnly) {
      this.$router.push({ query: { 'audio-only': 'true' } })
    }

    const username = this.$route.params.username

    await getEndpoint('api/users/' + username)
      .then((data) => {
        this.data = data
      })
      .catch(() => {
        this.status = 'error'
      })
  },
  components: {
    VideoPlayer,
    TwitchChat,
    ErrorMessage,
    FollowButton,
    LoadingScreen,
    VideoTab,
    AudioPlayer,
    AboutTab,
    ShareModal,
    VueTitle,
    ActionButtons
  },
  methods: {
    truncate,
    abbreviate,
    getSetting,
    toggleShareModal() {
      this.shareModalVisible = !this.shareModalVisible
    },
    toggleTheatreMode() {
      this.isTheatreMode = !this.isTheatreMode
    }
  }
}
</script>

<template>
  <share-modal
    v-if="shareModalVisible"
    :time="0"
    :useTime="false"
    @close="toggleShareModal"
  ></share-modal>
  <loading-screen v-if="!data && status != 'error'"></loading-screen>
  <error-message v-else-if="status == 'error'"></error-message>

  <div
    v-else-if="data"
    class="w-full justify-center md:inline-flex space-y-4 md:space-y-0 md:space-x-4 md:p-4"
  >
    <vue-title :title="data.username"></vue-title>
    <div
      :class="[
        'content-container',
        isTheatreMode ? 'content-container-theatre' : 'content-container-normal'
      ]"
    >
      <div v-if="data.isLive" class="w-full mx-auto rounded-lg mb-5">
        <video-player v-if="Boolean($route.query['audio-only']) === false" :options="videoOptions">
        </video-player>
        <audio-player v-else :masterManifestUrl="audioOptions"></audio-player>
      </div>

      <img
        v-else
        :src="data.banner"
        alt="Streamer banner"
        class="rounded-md opacity-70 relative mb-2"
      />

      <div class="w-full flex-wrap md:p-3">
        <div class="flex flex-col md:flex-row justify-between">
          <div class="md:w-3/5">
            <div class="inline-flex">
              <div class="w-20 h-20 relative">
                <img
                  :src="data.pfp"
                  class="rounded-full border-4 p-0.5 w-auto h-20"
                  :style="`border-color: ${data.colorHex};`"
                />
                <span
                  v-if="data.isLive"
                  class="absolute flex left-1/2 translate-x-[-50%] whitespace-nowrap uppercase top-16 bg-red font-bold text-sm p-1.5 py-0.5 rounded-md"
                >{{ $t('main.live') }}</span>
              </div>
              <div class="ml-3 content-between">
                <div>
                  <h1 class="text-2xl md:text-4xl font-bold inline-block">{{ data.username }}</h1>
                  <a v-if="$route.query['audio-only'] !== 'true'" href="?audio-only=true">
                    <v-icon name="bi-headphones" class="ml-1 w-8 h-8 inline-block"></v-icon>
                  </a>
                  <a v-else :href="$route.params.username.toString()">
                    <v-icon name="bi-camera-video-fill" class="ml-1 w-8 h-8 inline-block"></v-icon>
                  </a>
                </div>
                <div v-if="data.stream" class="w-full md:w-[17rem]">
                  <p class="text-sm font-bold text-neutral self-end">
                    {{ truncate(data.stream.title, 130) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="md:w-2/5 mt-4 md:mt-0">
            <div v-if="!data.isLive" class="w-full">
              <p class="font-bold bg-overlay0 p-3 py-2 rounded-lg w-min float-right border-2 border-red">
                OFFLINE
              </p>
            </div>
            <div v-else class="w-full">
              <ul class="flex flex-wrap justify-end gap-2 text-xs font-bold" v-if="getSetting('streamTagsVisible')">
                <li v-for="tag in data.stream!.tags" :key="tag" class="inline-flex bg-overlay0 p-1.5 px-2 rounded-md">
                  {{ tag }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center mt-4">
          <div class="pt-2 inline-flex">
            <follow-button :username="data.login"></follow-button>
            <p class="align-baseline font-bold ml-3">
              {{ abbreviate(data.followers) }} {{ $t('main.followers') }}
            </p>
          </div>
          <action-buttons
            :showDownload="false"
            :showTheatreMode="true"
            :showShare="true"
            @toggleTheatreMode="toggleTheatreMode"
            @toggleShareModal="toggleShareModal"
          />
        </div>
      </div>

      <!-- VIDEOS TAB -->
      <video-tab class="mb-4"></video-tab>

      <!-- ABOUT TAB -->
      <about-tab :socials="data.socials" :about="data.about"></about-tab>
    </div>

    <twitch-chat
      v-if="!getSetting('chatVisible')"
      :isLive="true"
      :channelName="data.login"
      class="h-2/3"
    ></twitch-chat>
  </div>
</template>

