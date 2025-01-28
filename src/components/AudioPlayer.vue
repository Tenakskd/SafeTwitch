<template>
  <div>
    <audio ref="videoPlayer" class="w-full" controls></audio>
  </div>
</template>
<script lang="ts">
// Importing video-js
import Hls from 'hls.js'
import { getSetting } from '@/settingsManager'

export default {
  name: 'VideoJsPlayer',
  props: {
    masterManifestUrl: {
      type: String,
      required: true
    }
  },
  emits: ['PlayerTimeUpdate'],
  async setup(props) {
    let player: any

    const getAudioOnlyManifestFromUrl = async (masterManifestUrl: string) => {
      const manifestRes = await fetch(masterManifestUrl)
      if (!manifestRes.ok) return

      const manifest = await manifestRes.text()
      // The last line of the manifest is the
      // audio only manifest. This is a bit hacky
      // but it'll work. If issues arise we can
      // always implement an actual m3u8 parser
      const tmp = manifest.split('\n')
      const audioOnlyManifest = tmp[tmp.length - 1]

      return audioOnlyManifest
    }

    const audioOnlyManifest = await getAudioOnlyManifestFromUrl(props.masterManifestUrl)
    return {
      player,
      audioOnlyManifest
    }
  },
  // initializing the video player
  // when the component is being mounted
  mounted() {
    const video = this.$refs.videoPlayer as HTMLVideoElement
    if (Hls.isSupported()) {
      const hls = new Hls()

      hls.loadSource(this.audioOnlyManifest || '')
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (getSetting('autoplay')) {
          video.play()
        }
      })
    }
  }
}
</script>
