<script lang="ts">
import { ref, inject } from 'vue'
import { useRoute } from 'vue-router'

import VideoPlayer from '@/components/VideoPlayer.vue'
import TwitchChat from '@/components/TwitchChat.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import FollowButton from '@/components/FollowButton.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import AboutTab from '@/components/user/AboutTab.vue'
import ShareModal from '@/components/popups/ShareButtonModal.vue'
import VueTitle from '@/components/VueTitle.vue'
import ActionButtons from '@/components/ActionButtons.vue'

import type { Video } from '@/types'
import { truncate, abbreviate, getEndpoint } from '@/mixins'
import { getSetting } from '@/settingsManager'

interface ChatComponent {
  updateVodComments: (time: number) => void
}

export default {
  inject: ['rootBackendUrl'],
  async setup() {
    const route = useRoute()
    const vodID = route.params.vodID
    const rootBackendUrl = inject('rootBackendUrl')
    const videoOptions = {
      autoplay: getSetting('autoplay'),
      controls: true,
      sources: [
        {
          src: `${rootBackendUrl}/proxy/vod/${vodID}/video.m3u8`,
          type: 'application/vnd.apple.mpegurl'
        }
      ],
      fluid: true
    }
    return {
      data: ref<Video>(),
      status: ref<'ok' | 'error'>(),
      videoOptions,
      time: ref(0),
      shareModalVisible: ref(false),
      isTheatreMode: ref(false)
    }
  },
  async mounted() {
    const vodID = this.$route.params.vodID

    await getEndpoint('api/vods/' + vodID)
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
    AboutTab,
    ShareModal,
    VueTitle,
    ActionButtons
  },
  methods: {
    truncate,
    abbreviate,
    handlePlayerTimeUpdate(time: number) {
      if (getSetting('chatVisible')) return
      const chat = this.$refs.chat as ChatComponent
      this.time = time
      chat.updateVodComments(time)
    },
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
    :time="time"
    :useTime="true"
    @close="toggleShareModal"
  ></share-modal>
  <loading-screen v-if="!data && status != 'error'"></loading-screen>
  <error-message v-else-if="status == 'error'"></error-message>

  <div
    v-else-if="data"
    class="w-full justify-center md:inline-flex space-y-4 md:space-y-0 md:space-x-4 md:p-4"
  >
    <vue-title :title="'VOD - ' + data.title"></vue-title>
    <div
      :class="[
        'content-container',
        isTheatreMode ? 'content-container-theatre' : 'content-container-normal'
      ]"
    >
      <div class="w-full mx-auto rounded-lg mb-5">
        <video-player :options="videoOptions" @PlayerTimeUpdate="handlePlayerTimeUpdate">
        </video-player>
      </div>

      <div class="w-full flex-wrap md:p-3">
        <div class="inline-flex md:w-full">
          <router-link :to="'/' + data.streamer.login">
            <img
              :src="data.streamer.pfp"
              class="rounded-full border-4 p-0.5 w-auto h-20"
              :style="`border-color: ${data.streamer.colorHex};`"
            />
          </router-link>

          <div class="ml-3 content-between w-5/6">
            <router-link :to="'/' + data.streamer.login">
              <h1 class="text-2xl md:text-4xl font-bold inline-block">{{ data.streamer.username }}</h1>
            </router-link>
            <p class="text-sm font-bold text-neutral self-end">
              {{ truncate(data.title, 130) }}
            </p>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <div class="pt-2 inline-flex">
            <follow-button :username="data.streamer.login"></follow-button>
            <p class="align-baseline font-bold ml-3">
              {{ abbreviate(data.streamer.followers) }} {{ $t('main.followers') }}
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

      <!-- ABOUT TAB -->
      <about-tab :socials="data.streamer.socials" :about="data.streamer.about"></about-tab>
    </div>

    <twitch-chat
      v-if="!getSetting('chatVisible')"
      :isVod="true"
      :channelName="data.streamer.login"
      ref="chat"
    ></twitch-chat>
  </div>
</template>
