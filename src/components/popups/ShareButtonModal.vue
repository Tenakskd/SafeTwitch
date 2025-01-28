<script lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'

export default {
  setup() {
    const route = useRoute()
    const instanceUrl = location.protocol + '//' + location.host
    let currentUrl = ref(instanceUrl)

    return {
      // remove any query from the path
      path: route.fullPath.split('?')[0],
      usingTwitchUrl: ref(false),
      usingTime: ref(false),
      query: ref(''),
      instanceUrl,
      currentUrl
    }
  },
  emits: ['close'],
  props: {
    time: {
      type: Number,
      default() {
        return 0
      }
    },
    useTime: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  methods: {
    formatSecondsToQuery(sec: number) {
      const date = new Date(sec * 1000)
      const hour = date.getHours()
      const minutes = date.getMinutes()
      const seconds = date.getSeconds()

      return `${hour}h${minutes}m${seconds}s`
    },
    toggleTwitchUrl() {
      if (this.usingTwitchUrl) {
        this.currentUrl = 'https://twitch.tv'
      } else {
        this.currentUrl = this.instanceUrl
      }
    },
    async copyUrl() {
      try {
        await navigator.clipboard.writeText(this.currentUrl + this.path + this.query)
        console.log('Content copied to clipboard')
      } catch (err) {
        console.error('Failed to copy: ', err)
      }
    },
    toggleTime() {
      if (this.usingTime) {
        const timestamp = this.formatSecondsToQuery(this.$props.time)
        this.query = '?t=' + timestamp
      } else {
        this.query = ''
      }
    },
    gotoUrl() {
      location.href = this.currentUrl + this.path + this.query
    }
  }
}
</script>

<template>
  <div
    class="fixed top-0 bottom-0 left-0 right-0 flex w-full z-50 h-[100vh] bg-opacity-50 bg-black"
  >
    <div
      class="bg-crust my-auto h-min mx-auto w-[35rem] max-w-[95vw] p-5 rounded-md relative z-50 text-contrast"
    >
      <div class="flex justify-between">
        <h1 class="text-3xl font-bold">{{ $t('share.share') }}</h1>
        <button @click="$emit('close')">
          <v-icon name="io-close-sharp" scale="1.8"></v-icon>
        </button>
      </div>
      <hr class="my-2" />
      <div class="flex bg-surface0 p-3 rounded-md h-12 overflow-x-scroll whitespace-nowrap">
        <p class="" ref="urlPreview">
          {{ currentUrl + path + query }}
        </p>
      </div>
      <ul class="mt-1">
        <li>
          <label class="flex items-center">
            <input
              :disabled="!useTime"
              class="align-middle w-4 h-4 mr-1 disabled:opacity-50"
              type="checkbox"
              @change="toggleTime()"
              v-model="usingTime"
            />
            {{ $t('share.addTimestamp') }}
          </label>

          <label class="flex items-center">
            <input
              class="align-middle w-4 h-4 mr-1"
              @change="toggleTwitchUrl()"
              v-model="usingTwitchUrl"
              type="checkbox"
            />
            {{ $t('share.twitchUrl') }}
          </label>
        </li>
      </ul>

      <div class="space-x-2 mt-1">
        <button class="p-2 py-1.5 bg-surface0 rounded-md" @click="copyUrl()">
          {{ $t('share.copyLink') }}
        </button>
        <button class="p-2 py-1.5 bg-surface0 rounded-md" @click="gotoUrl()">
          {{ $t('share.goto') }}
        </button>
      </div>
    </div>
  </div>
</template>
