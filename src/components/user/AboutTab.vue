<script lang="ts">
import { getSetting } from '@/settingsManager'
import type { Social } from '@/types'
import type { PropType } from 'vue'

export default {
  props: {
    socials: {
      type: Object as PropType<Social[]>
    },
    about: {
      type: String
    }
  },
  methods: {
    getSetting,
    getIconName(iconType: string) {
      console.log(iconType)
      const icons = ['Twitter', 'instagram', 'discord', 'youtube', 'tiktok', 'reddit']
      if (icons.includes(iconType)) {
        return 'bi-' + iconType
      } else {
        return 'bi-link-45deg'
      }
    }
  }
}
</script>

<template>
  <div
    v-if="getSetting('streamerAboutSectionVisible')"
    class="bg-primary mt-1 p-5 pt-3 rounded-lg w-full space-y-3"
  >
    <div class="inline-flex w-full">
      <span class="pr-3 font-bold text-3xl">{{ $t('streamer.about') }}</span>
    </div>

    <p class="mb-5">{{ about || $t('streamer.noAbout') }}</p>

    <hr class="my-auto w-full bg-gray-200 rounded-full opacity-40" />

    <ul v-if="socials" class="flex font-semibold text-md justify-start flex-wrap flex-row">
      <li v-for="link in socials" :key="link.url">
        <a :href="link.url" class="text-contrast hover:text-neutral mr-4 flex">
          <v-icon :name="getIconName(link.type)" class="w-6 h-6 mr-1"></v-icon>
          <span>{{ link.name }}</span>
        </a>
      </li>
    </ul>

    <p v-else>{{ $t('streamer.noSocials') }}</p>
  </div>
</template>
