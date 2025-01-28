<script lang="ts">
import VueTitle from './VueTitle.vue';

export default {}
</script>

<template>
  <VueTitle title="Error"></VueTitle>
  <div
    class="flex flex-col max-w-prose justify-center text-center mx-auto p-6 bg-crust rounded-lg text-contrast"
  >
    <div class="mb-6">
      <h1 class="font-bold text-5xl">{{ $t('error.oops') }}</h1>
      <p class="font-bold text-3xl">{{ $t('error.notsupposedtohappen') }}</p>
    </div>

    <p class="text-xl">
      {{ $t('error.serverexplain') }}
    </p>
  </div>
</template>
