<script lang="ts">
import { ref } from 'vue'

import StreamPreviewVue from '@/components/StreamPreview.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

import type { CategoryData } from '@/types'
import { getEndpoint, abbreviate } from '@/mixins'

export default {
  inject: ['protocol'],
  async setup() {
    let data = ref<CategoryData>()
    let status = ref<'ok' | 'error'>()

    return {
      data,
      status
    }
  },
  async mounted() {
    await getEndpoint('api/discover/' + encodeURIComponent(this.$route.params.game.toString()))
      .catch(() => {
        this.status = 'error'
      })
      .then((data: CategoryData) => {
        this.data = data
      })

    window.onscroll = this.getMoreStreams
  },
  beforeUnmount() {
    window.onscroll = null
  },
  methods: {
    async getMoreStreams() {
      let bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight
      const streams = this.data!.streams

      if (bottomOfWindow && streams) {
        // get cursor of the last stream rendered
        const cursor = streams[streams.length - 1].cursor
        if (!cursor) return

        // get rest of streams from api
        const resData: CategoryData = await getEndpoint(
          `api/discover/${this.$route.params.game}?cursor=${cursor}`
        ).catch((err) => {
          throw err
        })

        let lastStreamCursor = this.data!.streams[this.data!.streams.length - 1].cursor
        let newLastStreamCursor = resData.streams[resData.streams.length - 1].cursor
        if (lastStreamCursor === newLastStreamCursor) {
          // Add "no more streams!" screen later
          console.log('no more streams!')
        } else {
          for (let stream of resData.streams) {
            this.data!.streams.push(stream)
          }
        }
      }
    },
    abbreviate
  },
  components: {
    StreamPreviewVue,
    ErrorMessage,
    LoadingScreen
  }
}
</script>

<template>
  <loading-screen v-if="!data && status != 'error'"></loading-screen>
  <error-message v-else-if="status == 'error'"></error-message>

  <div v-else-if="data" class="flex flex-col max-w-5xl mx-auto">
    <div class="flex p-3 flex-col">
      <div class="inline-flex space-x-4">
        <img :src="data.cover" class="self-start rounded-md" />

        <div class="text-contrast">
          <h1 class="font-bold text-5xl">{{ data.name }}</h1>
          <div class="hidden md:block">
            <div>
              <div class="inline-flex my-1 space-x-3">
                <p class="font-bold text-lg">
                  {{ $t('main.followers') }}: {{ abbreviate(data.followers) }}
                </p>
                <p class="font-bold text-lg">
                  {{ $t('main.viewers') }}: {{ abbreviate(data.viewers) }}
                </p>
              </div>

              <ul class="mb-5">
                <li v-for="tag in data.tags" :key="tag" class="inline-flex">
                  <span class="p-1 py-0.5 mr-1 text-sm text-contrast font-bold bg-overlay1 rounded-sm">{{
                    tag
                  }}</span>
                </li>
              </ul>
            </div>
          </div>
          <p class="text-md text-contrast overflow-y-auto hidden md:block">
            {{ data.description }}
          </p>
        </div>
      </div>

      <div class="md:hidden">
        <div>
          <div class="inline-flex my-1 space-x-3">
            <p class="font-bold text-contrast text-lg">
              {{ $t('main.followers') }}: {{ abbreviate(data.followers) }}
            </p>
            <p class="font-bold text-contrast text-lg">
              {{ $t('main.viewers') }}: {{ abbreviate(data.viewers) }}
            </p>
          </div>

          <ul class="mb-5">
            <li v-for="tag in data.tags" :key="tag" class="inline-flex">
              <span class="text-contrast p-1 py-0.5 mr-1 text-sm font-bold bg-overlay1 rounded-sm">{{
                tag
              }}</span>
            </li>
          </ul>
        </div>
      </div>
      <p class="text-md text-contrast overflow-y-auto md:hidden">{{ data.description }}</p>
    </div>

    <div class="max-w-[58rem] mx-auto">
      <ul class="flex flex-wrap justify-center">
        <li
          v-for="stream in data.streams"
          :key="stream.title"
          class="inline-flex m-2 hover:scale-105 transition-transform"
        >
          <StreamPreviewVue :stream="stream"></StreamPreviewVue>
        </li>
      </ul>
    </div>
  </div>
</template>
