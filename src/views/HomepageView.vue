<script lang="ts">
import { ref } from 'vue'

import StreamPreviewVue from '@/components/StreamPreview.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import CategoryPreview from '@/components/CategoryPreview.vue'

import { getEndpoint, followersStreaming } from '@/mixins'
import type { CategoryPreview as CategoryPreviewInterface } from '@/types'
import { getFollows } from '@/settingsManager'
import VueTitle from '@/components/VueTitle.vue'

export default {
  async setup() {
    let data = ref<CategoryPreviewInterface[]>()
    let status = ref<'ok' | 'error'>()
    let followingStreaming = ref<string[]>()
    let following = ref<string[]>()

    return {
      data,
      status,
      filterTags: '',
      following,
      followingStreaming
    }
  },
  methods: {
    filterSearches(toFilter: string) {
      const categories = this.$refs.categoryItem
      const wantedTags: string[] = toFilter
        .toLowerCase()
        .split(',')
        .filter((v) => v.toLowerCase())

      for (let category of categories as any) {
        let tagElements = category.getElementsByTagName('span')
        let tags = []

        for (let tag of tagElements) {
          tags.push(tag.innerText.toLowerCase())
        }

        // Create sets from the arrays
        const [set1, set2] = [new Set(wantedTags), new Set(tags)]
        const common = [...set1].filter((x) => set2.has(x))

        if (common.length === wantedTags.length) {
          category.style.display = ''
        } else if (wantedTags[0] === '') {
          category.style.display = ''
        } else {
          category.style.display = 'none'
        }
      }
    },
    async getNextCategory() {
      let bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight
      if (bottomOfWindow && this.data) {
        const cursor = this.data[this.data.length - 1].cursor
        if (!cursor) return
        const res = await getEndpoint('api/discover?cursor=' + cursor)

        for (let category of res) {
          this.data.push(category)
        }
      }
    },
    async handleFollowingScroll(event: UIEvent) {
      let el = event.target as HTMLUListElement
      let fullyScrolled = el.scrollLeft === el.scrollWidth - el.clientWidth
      if (!fullyScrolled) return
      if (!this.following) return

      let offset = Math.floor(this.following.length / 35)
      console.log(offset)
      let newFollowers = await followersStreaming(this.following, offset)
      this.followingStreaming = [...this.following, ...newFollowers]
    }
  },
  async mounted() {
    window.onscroll = this.getNextCategory

    // get discover page
    await getEndpoint('api/discover')
      .catch(() => {
        this.status = 'error'
      })
      .then((data: CategoryPreviewInterface[]) => {
        this.data = data
      })

    this.followingStreaming = await followersStreaming(getFollows(), 0)
    this.following =  await getFollows()
  },
  components: {
    StreamPreviewVue,
    ErrorMessage,
    LoadingScreen,
    CategoryPreview,
    VueTitle
  }
}
</script>

<template>
  <loading-screen v-show="!data && status != 'error'"></loading-screen>
  <div v-show="status === 'error'">
    <error-message ></error-message>
  </div>

  <div v-show="data" class="max-w-5xl w-[100vw] mx-auto">
    <vue-title title="Discover"></vue-title>
    <div v-if="following && following.length > 0" class="p-2 text-contrast">
      <h1 class="font-bold text-5xl">{{ $t('home.following') }}</h1>
      <p class="text-xl">{{ $t('home.streamersYouFollow') }}</p>
      <ul
        class="overflow-x-auto whitespace-nowrap"
        @scroll="handleFollowingScroll"
      >
        <li v-for="streamer in followingStreaming" :key="streamer" class="mr-2 inline-block">
          <stream-preview-vue :name="streamer"></stream-preview-vue>
        </li>
      </ul>
    </div>

    <div class="p-2 text-contrast">
      <h1 class="font-bold text-5xl">{{ $t('home.discover') }}</h1>
      <p class="text-xl">{{ $t('home.discoverDescription') }}</p>

      <div class="pt-5 inline-flex">
        <p class="mr-2 font-bold">{{ $t('home.tagDescription') }}</p>
        <div class="relative">
          <label for="searchBar" class="hidden">{{ $t('main.search') }}</label>
          <v-icon name="io-search-outline" class="absolute my-auto inset-y-0 left-2"></v-icon>
          <input
            type="text"
            id="searchBar"
            name="searchBar"
            :placeholder="$t('main.search')"
            v-model="filterTags"
            @keypress="filterSearches(filterTags)"
            @keyup="filterSearches(filterTags)"
            class="rounded-md p-1 pl-8 placeholder:text-white"
          />
        </div>
      </div>
    </div>

    <ul ref="categoryList" class="flex flex-wrap justify-center">
      <li
        v-for="category in data"
        :key="category.name"
        ref="categoryItem"
        class="m-2 hover:scale-105 transition-transform"
      >
        <category-preview :category-data="category"></category-preview>
      </li>
    </ul>
  </div>
</template>
