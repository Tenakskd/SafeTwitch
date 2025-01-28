<script lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import VideoPlayer from '@/components/VideoPlayer.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import FollowButton from '@/components/FollowButton.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import AboutTab from '@/components/user/AboutTab.vue'
import ShareModal from '@/components/popups/ShareButtonModal.vue'
import VueTitle from '@/components/VueTitle.vue'
import ActionButtons from '@/components/ActionButtons.vue'

import type { Video } from '@/types'
import { truncate, abbreviate, getEndpoint } from '@/mixins'

export default {
  inject: ['rootBackendUrl'],
  async setup() {
    const route = useRoute()
    const clipSlug = route.params.slug
    const data = ref<Video>()
    const status = ref<'ok' | 'error'>()
    const isTheatreMode = ref(false)

    let srcUrl
    await getEndpoint(`api/clips/cliplink/${clipSlug}`)
      .then((data) => {
        srcUrl = data
      })
      .catch(() => {
        status.value = 'error'
      })

    const videoOptions = {
      autoplay: true,
      controls: true,
      sources: [
        {
          src: srcUrl,
          type: 'video/mp4'
        }
      ],
      fluid: true
    }

    return {
      data,
      status,
      videoOptions,
      time: ref(0),
      srcUrl,
      shareModalVisible: ref(false),
      isTheatreMode
    }
  },
  async mounted() {
    const clipSlug = this.$route.params.slug

    await getEndpoint(`api/clips/${clipSlug}`)
      .then((data) => {
        this.data = data
      })
      .catch(() => {
        this.status = 'error'
      })
  },
  components: {
    VideoPlayer,
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
  <share-modal v-if="shareModalVisible" :useTime="false" @close="toggleShareModal"></share-modal>
  <loading-screen v-if="!data && status != 'error'"></loading-screen>
  <error-message v-else-if="status == 'error'"></error-message>

  <div
    v-else-if="data"
    class="w-full justify-center md:inline-flex space-y-4 md:space-y-0 md:space-x-4 md:p-4"
  >
    <VueTitle :title=" 'Clip - ' + data.title"></VueTitle>
    <div
      :class="[
        'content-container',
        isTheatreMode ? 'content-container-theatre' : 'content-container-normal'
      ]"
    >
      <div class="w-full mx-auto rounded-lg mb-5">
        <video-player :options="videoOptions"> </video-player>
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

          <div class="ml-3 content-between">
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
            <follow-button :username="data.streamer.username"></follow-button>
            <p class="align-baseline font-bold ml-3">
              {{ abbreviate(data.streamer.followers) }} {{ $t('main.followers') }}
            </p>
          </div>

          <action-buttons
            :showDownload="true"
            :showTheatreMode="true"
            :showShare="true"
            @toggleTheatreMode="toggleTheatreMode"
            @toggleShareModal="toggleShareModal"
            :downloadUrl="srcUrl"
          />
        </div>
      </div>

      <!-- ABOUT TAB -->
      <about-tab :socials="data.streamer.socials" :about="data.streamer.about"></about-tab>
    </div>
  </div>
</template>