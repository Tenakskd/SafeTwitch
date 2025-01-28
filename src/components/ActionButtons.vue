<template>
    <div class="space-x-1">
      <a v-if="showDownload" :href="downloadUrl" download>
        <button class="px-2 py-1.5 rounded-lg bg-purple">
          <v-icon name="md-download-round"></v-icon>
        </button>
      </a>
      <button v-if="showTheatreMode" @click="$emit('toggleTheatreMode')" class="hidden xl:inline px-2 py-1.5 rounded-lg bg-purple">
        <v-icon name="fa-expand"></v-icon>
      </button>
      <button v-if="showShare" @click="$emit('toggleShareModal')" class="px-2 py-1.5 rounded-lg bg-purple">
        <v-icon name="fa-share-alt"></v-icon>
      </button>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    props: {
      showDownload: Boolean,
      showTheatreMode: Boolean,
      showShare: Boolean,
      downloadUrl: String
    },
    emits: ['toggleTheatreMode', 'toggleShareModal']
  }
  </script>
  