<script lang="ts">
import { ref } from 'vue'
import SearchBar from './SearchBar.vue'
export default {
  components: {
    SearchBar
  },
  setup() {
    return {
      open: ref(false)
    }
  },
  methods: {
    toggle() {
      this.open = !this.open
    }
  },
  mounted() {
    const savedLocale = localStorage.getItem('language')
    if (savedLocale) {
      this.$i18n.locale = savedLocale
    }
  }
}
</script>

<template>
  <nav class="flex items-center justify-between flex-wrap p-4">
    <div class="flex items-center flex-no-shrink text-contrast mr-6">
      <router-link to="/">
        <h1 class="font-bold text-2xl">Safe<span class="text-purple">Twitch</span></h1>
      </router-link>
    </div>

    <search-bar class="mt-4 mr-4 hidden md:inline-block sm:mt-0"></search-bar>

    <div class="text-contrast hidden space-x-4 md:block">
      <a href="https://codeberg.org/safetwitch/safetwitch" target="_blank">{{ $t('nav.code') }}</a>
      <a :href="'https://twitch.tv' + $route.fullPath">Twitch</a>
      <router-link to="/privacy">{{ $t('nav.privacy') }}</router-link>
      <router-link to="/following">{{ $t('home.following') }}</router-link>
      <router-link to="/settings">{{ $t('nav.settings') }}</router-link>
    </div>

    <div class="block md:hidden">
      <button @click="toggle" class="flex items-center px-3 py-2">
        <svg
          class="fill-current text-contrast h-3 w-3"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
    </div>

    <div :class="open ? 'block' : 'hidden'" class="w-full flex-grow">
      <div class="p-4 flex flex-col items-center space-y-5 text-contrast">
        <search-bar></search-bar>
        <ul class="inline-flex space-x-3 md:space-x-6 font-medium">
          <a href="https://codeberg.org/dragongoose/safetwitch">{{ $t('nav.code') }}</a>
          <a :href="'https://twitch.tv' + $route.fullPath">Twitch</a>
          <router-link to="/privacy">{{ $t('nav.privacy') }}</router-link>
          <router-link to="/following">{{ $t('home.following') }}</router-link>
          <router-link to="/settings">{{ $t('nav.settings') }}</router-link>
        </ul>
      </div>
    </div>
  </nav>
</template>
