<script lang="ts">
import { ref } from 'vue'

import CategoryPreview from '@/components/CategoryPreview.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import StreamPreviewVue from '@/components/StreamPreview.vue'
import ChannelPreview from '@/components/ChannelPreview.vue'

import { getEndpoint } from '@/mixins'
import type { SearchResult, StreamerData } from '@/types'

export default {
  inject: ['protocol'],
  setup() {
    let data = ref<SearchResult>()
    const status = ref<'ok' | 'error'>()
    return {
      data,
      status
    }
  },
  async mounted() {
    await getEndpoint('api/search/?query=' + this.$route.query.query)
      .catch(() => {
        this.status = 'error'
      })
      .then((data) => {
        this.data = data as SearchResult
      })
  },
  methods: {
    getStream(channel: StreamerData) {
      return {
        ...channel.stream,
        streamer: {
          name: channel.username,
          pfp: channel.pfp
        }
      }
    }
  },
  components: {
    CategoryPreview,
    ErrorMessage,
    LoadingScreen,
    StreamPreviewVue,
    ChannelPreview
  }
}
</script>
<template>
  <loading-screen v-if="!data && status != 'error'"></loading-screen>
  <error-message v-else-if="status == 'error'"></error-message>

  <div v-else-if="data" class="p-3 space-y-5">
    <div v-if="data.channels.length > 0">
      <h1 class="text-contrast font-bold text-4xl mb-2">
        Channels related to "{{ $route.query.query }}"
      </h1>
      <ul class="flex overflow-x-scroll overflow-y-hidden">
        <li
          v-for="channel in data.channels"
          :key="channel.id"
          class="m-2 hover:scale-105 transition-transform"
        >
          <channel-preview :channel="channel"></channel-preview>
        </li>
      </ul>
    </div>

    <div v-if="data.categories.length > 0">
      <h1 class="text-contrast font-bold text-4xl mb-2">
        Categories related to "{{ $route.query.query }}"
      </h1>
      <ul class="flex max-w-[100vw] max-h-[27rem] overflow-x-scroll overflow-y-hidden">
        <li
          v-for="category in data.categories"
          :key="category.name"
          class="m-2 hover:scale-105 transition-transform"
        >
          <category-preview :category-data="category"></category-preview>
        </li>
      </ul>
    </div>

    <div v-if="data.relatedChannels.length > 0">
      <h1 class="text-contrast font-bold text-4xl mb-2">
        Live channels with the tag "{{ $route.query.query }}"
      </h1>
      <ul class="flex overflow-x-scroll space-x-5">
        <li v-for="channel in data.relatedChannels" :key="channel.id">
          <stream-preview-vue :stream="getStream(channel)"></stream-preview-vue>
        </li>
      </ul>
    </div>

    <div v-if="data.channelsWithTag.length > 0">
      <h1 class="text-contrast font-bold text-4xl mb-2">
        Channels with the tag "{{ $route.query.query }}"
      </h1>
      <ul class="inline-flex overflow-y-hidden overflow-x-scroll max-w-[100vw] space-x-5">
        <li v-for="channel in data.channelsWithTag" :key="channel.id">
          <channel-preview :channel="channel"></channel-preview>
        </li>
      </ul>
    </div>
  </div>
</template>
