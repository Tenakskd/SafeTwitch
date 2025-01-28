<script lang="ts">
interface Badge {
  id: string
  title: string
  setId: string
  version: string
  images: { [k: string]: string }
}

export default {
  props: {
    badgeInfo: {
      type: Object
    }
  },

  setup(props) {
    const data = props.badgeInfo as Badge
    return {
      src: data.images.image1x,
      name: data.title
    }
  }
}
</script>

<template>
  <img :src="src" class="w-3.5 h-3.5 rounded-sm" />
</template>
