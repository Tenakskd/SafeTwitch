<script lang="ts">
import VueTitle from '@/components/VueTitle.vue';

export default {
  components: {
    VueTitle
  }
}
</script>

<template>
  <vue-title title="Not Found"></vue-title>
  <div class="flex flex-col items-center pt-10 font-bold text-5xl text-contrast">
    <h1>{{ $t('error.oops') }}</h1>
    <h1>{{ $t('error.notfound') }}</h1>
    <h2 class="text-4xl">maybe go <RouterLink to="/" class="text-contrast">home</RouterLink>?</h2>
  </div>
</template>
