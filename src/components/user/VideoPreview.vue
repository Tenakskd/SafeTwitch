<template>
  <div class="min-w-[300px]">
    <div class="relative">
      <RouterLink v-if="videoData.type === 'vod'" :to="'/videos/' + videoData.id">
        <img :src="videoData.preview" class="rounded-md" width="300" />
      </RouterLink>
      <RouterLink v-else :to="`${$route.params.username}/clip/${videoData.id}`">
        <img :src="videoData.preview" class="rounded-md" width="300" />
      </RouterLink>
      <p
        class="absolute bottom-2 right-2 bg-secondary bg-opacity-70 p-1 py-0.5 rounded-md text-xs font-bold"
      >
        {{ new Date(videoData.duration * 1000).toISOString().slice(11, 19) }}
      </p>
      <p
        class="absolute bottom-2 left-2 bg-secondary bg-opacity-70 p-1 py-0.5 rounded-md text-xs font-bold"
      >
        {{ abbreviate(videoData.views) }} {{ $t('main.views') }}
      </p>
    </div>

    <div class="pt-2 space-x-2">
      <div class="space-x-2 inline-flex">
        <RouterLink :to="'/game/' + videoData.game.name">
          <img :src="videoData.game.image" />
        </RouterLink>

        <div class="w-full">
          <p class="font-bold text-sm truncate h-6 max-w-[255px]">{{ videoData.title }}</p>
          <div class="text-xs text-neutral">
            <p>{{ videoData.streamer.login }}</p>
            <p>{{ videoData.game.displayName || videoData.game.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Video } from '@/types/VOD'
import { abbreviate } from '@/mixins'

export default {
  props: {
    data: Object
  },
  setup(props) {
    return {
      videoData: props.data as Video
    }
  },
  methods: {
    abbreviate
  }
}
</script>
