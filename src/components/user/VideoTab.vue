<!--
    This component is used for the video tab under a user
-->

<template>
  <div class="bg-primary mt-1 p-5 pt-3 rounded-lg w-full space-y-3">
    <div class="inline-flex w-full">
      <span class="pr-3 font-bold text-3xl">{{ $t('streamer.videos') }}</span>
    </div>

    <h1 v-if="!shelves && status === 'error'">{{ $t('streamer.videoerror') }}</h1>

    <div v-else-if="shelves" class="mb-5">
      <div class="space-y-5">
        <div v-for="shelve of shelves" :key="shelve.title">
          <h1 class="font-bold text-lg">{{ shelve.title }}</h1>

          <div
            class="whitespace-nowrap overflow-x-auto overflow-y-hidden w-full inline-flex space-x-5"
          >
            <video-preview
              v-for="video of shelve.videos"
              :key="video.title"
              :data="video"
            ></video-preview>
          </div>
        </div>
        <hr />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'

import { getEndpoint } from '@/mixins'
import type { Shelve } from '@/types/VOD'
import VideoPreview from '@/components/user/VideoPreview.vue'

export default {
  setup() {
    return {
      shelves: ref<Shelve[]>([]),
      status: ''
    }
  },
  async mounted() {
    const username = this.$route.params.username

    await getEndpoint('api/vods/shelve/' + username)
      .then((data) => {
        this.shelves = data
      })
      .catch(() => {
        this.status = 'error'
      })
  },
  components: {
    VideoPreview
  }
}
</script>
