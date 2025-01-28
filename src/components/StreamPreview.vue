<script lang="ts">
import { inject } from 'vue'
import { getEndpoint, abbreviate } from '@/mixins'
import type { StreamerData, CategoryMinifiedStream } from '@/types'

export default {
  props: {
    stream: {
      type: Object
    },
    name: {
      type: String
    }
  },
  async setup(props) {
    const protocol = inject('protocol')
    let data: StreamerData
    if (props.stream) {
      const streamData = props.stream as CategoryMinifiedStream
      // lossy converstion to avoid making tons of requests
      // by using minimal data from category request
      data = {
        username: streamData.streamer.name,
        login: streamData.streamer.name,
        followers: 0,
        isLive: true,
        about: '',
        pfp: streamData.streamer.pfp,
        banner: '',
        isPartner: false,
        colorHex: streamData.streamer.colorHex,
        id: 0,
        stream: {
          title: streamData.title,
          tags: streamData.tags,
          startedAt: 0,
          topic: '',
          viewers: streamData.viewers,
          preview: streamData.preview
        }
      }
    } else {
      data = await getEndpoint('api/users/' + props.name)
    }

    const frontend_url = protocol + import.meta.env.SAFETWITCH_INSTANCE_DOMAIN

    return {
      frontend_url,
      data,
      protocol
    }
  },
  methods: {
    abbreviate
  }
}
</script>

<template>
  <div v-if="data.stream">
    <div class="bg-crust rounded-lg w-[23rem] md:w-[27rem]">
      <RouterLink :to="'/' + data.login">
        <img :src="data.stream.preview" class="rounded-lg rounded-b-none" />
      </RouterLink>
      <div class="text-contrast p-2 inline-flex space-x-2 w-full h-16">
        <div class="inline-flex">
          <div class="inline-flex">
            <img :src="data.pfp" class="rounded-full w-12 mr-2" />
            <div class="w-full">
              <p class="font-bold w-[18rem] md:w-[23rem] truncate" :title="data.stream.title">
                {{ data.stream.title }}
              </p>
              <div class="inline-flex w-full justify-between">
                <p class="text-neutral">{{ data.username }}</p>
                <p class="self-end float-right">
                  <v-icon name="io-person"></v-icon> {{ abbreviate(data.stream.viewers) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
