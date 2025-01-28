<template>
  <div>
    <video id="video-player" class="video-js vjs-defaultskin"></video>
  </div>
</template>
<script lang="ts">
// Importing video-js
import videojs from 'video.js'
import qualityLevels from 'videojs-contrib-quality-levels'
import { createQualitySelector } from '@/assets/qualitySelector'
import { getTimeFromQuery } from '@/mixins'
import 'video.js/dist/video-js.css'

videojs.registerPlugin('qualityLevels', qualityLevels)

export default {
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  emits: ['PlayerTimeUpdate'],
  setup() {
    let player: any
    return {
      player
    }
  },
  // initializing the video player
  // when the component is being mounted
  mounted() {
    const emit = this.$emit
    this.player = videojs('video-player', this.options, () => {
      createQualitySelector(this.player)

      if (this.$route.query['t']) {
        const timeQuery = this.$route.query['t'].toString() || ''
        const time = getTimeFromQuery(timeQuery)
        this.player.currentTime(time)
      }

      this.player.on('timeupdate', () => {
        emit('PlayerTimeUpdate', this.player.currentTime())
      })
    })
  },
  unmounted() {
    this.player.dispose()
  }
}
</script>
