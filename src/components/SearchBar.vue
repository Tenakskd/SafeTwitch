<script lang="ts">
export default {
  setup() {
    return {
      searchInput: ''
    }
  },
  methods: {
    redirectToSearch() {
      const query = this.searchInput
      this.$router.push({ path: '/search/', query: { query } })
    }
  }
}
</script>

<template>
  <div class="relative md:block">
    <label for="searchBar" class="hidden">{{ $t('main.search') }}</label>
    <v-icon name="io-search-outline" class="absolute my-auto inset-y-0 left-2"></v-icon>
    <input
      type="text"
      id="searchBar"
      name="searchBar"
      :placeholder="$t('main.search')"
      v-model="searchInput"
      @keyup.enter="redirectToSearch"
      class="rounded-md p-1 pl-8 w-56 text-black bg-white placeholder:text-black"
    />
  </div>
</template>
