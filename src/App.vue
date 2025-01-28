<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavbarItem from './components/NavbarView.vue'
import FooterItem from './components/FooterView.vue'
import DevWarning from './components/DevWarning.vue'

import { getTheme } from '@/settingsManager'

const dev = import.meta.env.DEV
</script>

<template>
  <dev-warning v-if="dev"></dev-warning>
  <div :class="getTheme()" class="flex flex-col justify-between min-h-[100vh] bg-primary">
    <navbar-item></navbar-item>

    <Suspense>
      <RouterView :key="$route.fullPath" />
    </Suspense>

    <footer-item></footer-item>
  </div>
</template>
