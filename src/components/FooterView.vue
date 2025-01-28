<script lang="ts">
const dev = import.meta.env.DEV

export default {
  setup() {
    let version = `${import.meta.env.SAFETWITCH_TAG}-${import.meta.env.SAFETWITCH_COMMIT_HASH}`

    if (dev) {
      version = version + '-dev'
    }

    return {
      version
    }
  }
}
</script>

<template>
  <div class="m-2 mt-5 flex justify-center">
    <p class="text-contrast font-bold">SafeTwitch {{ version }}</p>
  </div>
</template>
