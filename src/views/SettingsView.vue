<script lang="ts">
import { ref } from 'vue'
import {
  getDefaultSettings,
  syncUserSettings,
  setLanguage,
  themeList,
  getTheme,
  getFollows
} from '@/settingsManager'
import type { Settings } from '@/settingsManager'
import VueTitle from '@/components/VueTitle.vue';

export default {
  setup() {
    let settings: Settings
    let storedSettings = localStorage.getItem('settings')
    if (storedSettings === null) {
      settings = getDefaultSettings()
    } else {
      settings = JSON.parse(storedSettings)
    }

    const syncResp = syncUserSettings(settings)
    if (syncResp.changed) {
      settings = syncResp.settings
    }

    let selectedTheme = getTheme()

    return {
      settings,
      themeList,
      selectedTheme: ref(selectedTheme)
    }
  },
  methods: {
    save() {
      const settings = JSON.stringify(this.settings)
      localStorage.setItem('settings', settings)
      console.log(this.settings)
      setLanguage(this.settings.settings.language.selected, this.$i18n)

      this.setTheme()
      // Reload needed
      location.href = '/'
    },
    setTheme() {
      localStorage.setItem('theme', this.selectedTheme)
    },
    highlight(theme: string) {
      if (this.selectedTheme == theme) {
        return 'border-purple'
      }
      return 'border-none'
    },
    download() {
      var hiddenElement = document.createElement('a')

      this.settings.followers = getFollows()

      hiddenElement.href = 'data:attachment/text,' + encodeURI(JSON.stringify(this.settings))
      hiddenElement.target = '_blank'
      hiddenElement.download = 'safetwitch_prefs.json'
      hiddenElement.click()
    },
    async handleImport(event: any) {
      const file = await event.target.files[0].text()
      const parsed = JSON.parse(file)
      let settings: Settings

      if (parsed.version !== getDefaultSettings().version && parsed.version !== undefined) {
        const syncResp = syncUserSettings(parsed)
        settings = syncResp.settings
      } else {
        settings = parsed
      }

      localStorage.setItem('following', JSON.stringify(settings.followers))
      this.settings = settings
      this.save()
    }
  },
  components: {
    VueTitle
  }
}
</script>

<template>
  <vue-title title="Settings"></vue-title>
  <div class="mx-auto w-[35rem] max-w-[95vw] p-5 py-3 bg-secondary rounded-md text-contrast">
    <h1 class="font-bold text-3xl">{{ $t('nav.settings') }}</h1>
    <hr class="my-2" />
    <ul class="w-full space-y-1">
      <li v-for="setting in settings.settings" :key="setting.type">
        <div v-if="setting.type == 'checkbox'" class="justify-between items-center flex">
          <label :for="setting.name">{{ $t(`settings.${setting.name}`) }}</label>
          <input :name="setting.name" type="checkbox" v-model="setting.selected" />
        </div>

        <div v-else-if="setting.type == 'option'" class="justify-between items-center flex">
          <label :for="setting.name">{{ $t(`settings.${setting.name}`) }}</label>
          <select
            :name="setting.name"
            type="checkbox"
            v-model="setting.selected"
            class="text-black rounded-md h-8 p-0 pr-8 pl-2"
          >
            <option v-for="option of setting.options" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
      </li>
    </ul>

    <h1 class="font-bold text-3xl mt-2">{{ $t('main.themes') }}</h1>
    <hr class="my-2" />
    <ul class="flex space-x-2">
      <!-- 
        Use theme colors for preview
       -->
      <li
        v-for="theme in themeList"
        :key="theme.name"
        class="hover:scale-110 border-2 rounded-md transition-transform"
        :class="highlight(theme.name)"
      >
        <button
          @click="selectedTheme = theme.name"
          class="p-5 py-1.5 border-4 rounded-md"
          :style="`border-color: ${theme.extend.colors.primary}; background:${theme.extend.colors.crust}; color:${theme.extend.colors.contrast};`"
        >
          <p>{{ theme.name }}</p>
        </button>
      </li>
    </ul>

    <div class="space-x-2 mt-3">
      <button @click="save" class="bg-surface0 p-4 py-2 rounded-md">
        {{ $t('settings.saveButton') }}
      </button>
      <button @click="download" class="bg-surface0 p-4 py-2 rounded-md">Export</button>
      <input
        type="file"
        @change="handleImport"
        name="fileinput"
        ref="fileinput"
        class="bg-surface0 p-4 py-2 rounded-md"
      />
    </div>
  </div>
</template>
