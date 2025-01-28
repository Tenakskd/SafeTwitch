<script lang="ts">
export default {
  props: {
    channel: {
      type: Object
    }
  },
  setup(props) {
    return {
      channelData: props.channel
    }
  }
}
</script>

<template>
  <router-link v-if="channelData" :to="'/' + channelData.username">
    <div class="p-3 rounded-lg bg-crust w-max max-w-lg max-h-28">
      <div class="inline-flex space-x-3">
        <img :src="channelData.pfp" class="rounded-full w-20" />
        <div>
          <div class="inline-flex w-full justify-between">
            <h1 class="text-contrast text-3xl font-bold">{{ channelData.username }}</h1>
            <p class="text-contrast float-right ml-5">{{ channelData.followers }} followers</p>
          </div>
          <p class="text-contrast overflow-y-hidden overflow-ellipsis max-h-12">
            {{ channelData.about }}
          </p>
        </div>
      </div>
    </div>
  </router-link>
</template>
