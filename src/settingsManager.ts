const locales = [
  'en-US',
  'es-ES',
  'nl-NL',
  'pt-PT',
  'fa-IR',
  'he-IL',
  'ru-RU',
  'ko-KR',
  'cs-CZ',
  'pl-PL',
  'it-IT',
  'fr-FR',
  'uk-UA',
  'de-DE',
  'zh-Hans',
  'ca-ES',
  'fi-FI',
  'tr-TR',
  'vi-VN'
]
const languages = [
  'English',
  'Español',
  'Nederlands',
  'Português',
  'فارسی',
  'עִבְרִית',
  'Русский',
  '한국어',
  'Česky',
  'Polski',
  'Italia',
  'Français',
  'Українська',
  'Deutsch',
  '中文（简体）',
  'Català',
  'Suomi',
  'Türkçe',
  'Tiếng Việt'
]

export interface SettingsCheckbox {
  name: string
  selected: boolean
  type: 'checkbox'
}

export interface SettingsOptions {
  name: string
  options: string[]
  selected: string
  type: 'option'
}

export interface Settings {
  version: string
  settings: {
    audioOnly: SettingsCheckbox
    defaultQuality: SettingsOptions
    language: SettingsOptions
    chatVisible: SettingsCheckbox
    streamTagsVisible: SettingsCheckbox
    streamerAboutSectionVisible: SettingsCheckbox
    autoplay: SettingsCheckbox
  }
  followers: string[]
}

/**
 * Sets the language by locale
 * @param selectedLanguage language to set
 * @param i18n the i18n class in use
 */
export const setLanguage = (selectedLanguage: string, i18n: any) => {
  // Locales and languages in arrays to match them
  const locale = locales[languages.indexOf(selectedLanguage)]
  localStorage.setItem('language', locale)
  i18n.locale = locale
}

/**
 * Returns the default settings
 * @returns Settings
 */
export function getDefaultSettings(): Settings {
  return {
    version: import.meta.env.SAFETWITCH_TAG,
    settings: {
      audioOnly: {
        name: 'audioOnly',
        selected: false,
        type: 'checkbox'
      },
      defaultQuality: {
        name: 'defaultQuality',
        options: ['160p', '360p', '480p', '720p', '1080p'],
        selected: '480p',
        type: 'option'
      },
      language: {
        name: 'language',
        options: languages,
        selected: 'English',
        type: 'option'
      },
      chatVisible: {
        name: 'chatVisible',
        selected: false,
        type: 'checkbox'
      },
      streamTagsVisible: {
        name: 'streamTagsVisible',
        selected: true,
        type: 'checkbox'
      },
      streamerAboutSectionVisible: {
        name: 'streamerAboutSectionVisible',
        selected: true,
        type: 'checkbox'
      },
      autoplay: {
        name: 'autoplay',
        selected: false,
        type: 'checkbox'
      }
    },
    followers: []
  }
}

/**
 * Syncs older user setting to the latest version
 * @param settings Settings of the Settings type
 * @returns The synced settings and a boolean stating if the settings were modified
 */
export function syncUserSettings(settings: Settings): { settings: Settings; changed: boolean } {
  const defaultSettings = getDefaultSettings()
  let userSettings = settings

  // converting settings storage from versions older
  // than 2.4.1
  let oldMigration = false

  if (userSettings.version === import.meta.env.SAFETWITCH_TAG) {
    console.log('Settings up to date!')
    return { settings: userSettings, changed: false }
  } else {
    console.log('Settings outdated... Migrating')
    // converts v2.4.1 to 241
    const settingsVersion = Number(
      userSettings.version.slice(1, defaultSettings.version.length).split('.').join('')
    )

    if (settingsVersion < 241) {
      oldMigration = true
    }
  }

  if (oldMigration) {
    const oldSettings: any = userSettings
    delete oldSettings.version
    const migrated: Settings = {
      version: defaultSettings.version,
      settings: {
        ...oldSettings
      },
      followers: []
    }

    userSettings = migrated
  }
  console.log(userSettings)

  const synced = { ...defaultSettings, ...userSettings }

  // update avaliable languages
  synced.settings.language.options = defaultSettings.settings.language.options
  synced.version = import.meta.env.SAFETWITCH_TAG
  localStorage.setItem('settings', JSON.stringify(synced))
  console.log('Migrated!')
  return { settings: synced, changed: true }
}

/**
 * Gets a users' setting's value from the setting's key
 * @param key Setting key to get
 * @returns a boolean or string depending on setting type
 * @example
 * getSetting("audioOnly") // false
 */
export function getSetting(key: string): boolean | string {
  const storage = localStorage.getItem('settings')
  let parsed
  if (!storage) {
    parsed = getDefaultSettings()
  } else {
    parsed = JSON.parse(storage)
  }

  return parsed.settings[key].selected
}

export function getFollows(): string[] {
  const follows = localStorage.getItem('following') || '[]'
  const parsedFollows: string[] = JSON.parse(follows)

  return parsedFollows
}

/**
 * Gets the current theme
 * @returns the name of the current theme
 * @default string light
 */
export function getTheme(): string {
  const selectedTheme = localStorage.getItem('theme') || import.meta.env.SAFETWITCH_DEFAULT_THEME

  if (selectedTheme === '') {
    return 'light'
  }

  // Make sure theme exists
  const t = themeList.filter((theme) => theme.name === selectedTheme)
  if (t.length === 0) {
    console.error(`Theme ${selectedTheme} does not exist... Perhaps improperly setup instance defaults or improper config?
    Stored Theme: ${localStorage.getItem('theme')}
    Default Theme: ${import.meta.env.SAFETWITCH_DEFAULT_THEME}
    `)
    return 'light'
  }

  return selectedTheme
}

// every avaliable theme
export const themeList = [
  {
    // name your theme anything that could be a valid css class name
    // remember what you named your theme because you will use it as a class to enable the theme
    name: 'dark',
    // put any overrides your theme has here
    // just as if you were to extend tailwind's theme like normal https://tailwindcss.com/docs/theme#extending-the-default-theme
    extend: {
      colors: {
        primary: '#141515',
        secondary: '#1e1f1f',
        overlay0: '#282a2a',
        overlay1: '#323434',
        surface0: '#393B3B',
        surface1: '#3F4242',
        crust: '#0C0C0C',
        purple: '#D946EF',
        red: '#980C0C',
        neutral: '#bdbdbd',
        contrast: 'white'
      }
    }
  },
  {
    // name your theme anything that could be a valid css class name
    // remember what you named your theme because you will use it as a class to enable the theme
    name: 'light',
    // put any overrides your theme has here
    // just as if you were to extend tailwind's theme like normal https://tailwindcss.com/docs/theme#extending-the-default-theme
    extend: {
      colors: {
        primary: '#ebeaea',
        secondary: '#e1e0e0',
        overlay0: '#d7d5d5',
        overlay1: '#cdcbcb',
        surface0: '#c6c4c4',
        surface1: '#c0bdbd',
        crust: '#fafafa',
        purple: '#D946EF',
        red: '#e81304',
        neutral: 'gray',
        contrast: 'black'
      }
    }
  }
]
