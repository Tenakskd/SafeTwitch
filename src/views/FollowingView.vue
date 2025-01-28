<script lang="ts">
import { ref, inject } from 'vue'

import FollowButton from '@/components/FollowButton.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import VueTitle from '@/components/VueTitle.vue'

import { getFollows } from '@/settingsManager'
import { postEndpoint, abbreviate, getParsedFollowing } from '@/mixins'
import type { FollowingStreamer } from '@/types'

export default {
  inject: ['rootBackendUrl'],
  setup() {
    let data = ref<FollowingStreamer[]>([])
    let status = ref<'ok' | 'error'>()

    return {
      data,
      status,
      rootBackendUrl: inject('rootBackendUrl')
    }
  },
  methods: {
    abbreviate,
    async getNextFollowingStage() {
      let bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight

      if (!bottomOfWindow) return

      const follows = getFollows()

      // do not make request if no followers
      if (follows.length == 0) {
        this.data = []
        return
      }

      let cursor = this.data.length / 35
      let maxCursor = follows.length / 35
      if (cursor > maxCursor) return

      let chunk = await getParsedFollowing(follows, cursor)
      this.data = [...this.data, ...chunk]
    }
  },
  async mounted() {
    const follows = getFollows()

    window.onscroll = this.getNextFollowingStage
    this.data = await getParsedFollowing(follows, 0)
  },
  components: {
    LoadingScreen,
    FollowButton,
    ErrorMessage,
    VueTitle
  }
}
</script>
<template>
  <loading-screen v-if="!data && status != 'error'"></loading-screen>
  <error-message v-else-if="status == 'error'"></error-message>
  <div
    v-else-if="data"
    class="md:max-w-[50rem] w-full mx-auto text-contrast flex flex-col justify-center"
  >
    <vue-title title="Following"></vue-title>
    <div v-if="data.length == 0" class="text-center">
      <h1 class="text-3xl font-bold">{{ $t('following.empty') }}</h1>
      <p>{{ $t('following.followAdvice') }}</p>
    </div>

    <div v-else class="text-center">
      <h1 class="text-3xl font-bold">{{ $t('home.following') }}</h1>
      <p>{{ $t('home.streamersYouFollow') }}</p>
    </div>

    <ul class="m-2 flex flex-wrap justify-center">
      <li v-for="streamer in data" :key="streamer.login" class="">
        <div class="inline-flex bg-overlay0 p-2.5 m-1 rounded-md w-[22rem]">
          <img :src="streamer.pfp" class="w-16 rounded-full" />
          <div class="justify-between flex flex-col ml-2 truncate text-ellipsis w-[8rem]">
            <h1 class="text-2xl font-bold"><router-link :to="streamer.login">{{ streamer.username }}</router-link></h1>
            <span>{{ abbreviate(streamer.followers) }} Followers</span>
          </div>
          <div class="m-auto">
            <follow-button :username="streamer.login"></follow-button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
