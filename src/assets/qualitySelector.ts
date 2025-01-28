// @ts-nocheck

import videojs from 'video.js'
import 'videojs-contrib-quality-levels'
import type { QualityLevelList, QualityLevel } from 'videojs-contrib-quality-levels'
import i18n from '@/i18n'
import { getSetting } from '@/settingsManager'

export const createQualitySelector = (player: any) => {
  const qualityLevels: QualityLevelList = player.qualityLevels()
  const MenuButton = videojs.getComponent('MenuButton')
  const MenuItem = videojs.getComponent('MenuItem')
  let formatedQualities: { name: string; index: number; id: string }[]

  const t = i18n.global.t

  const setQuality = (id: string) => {
    const found = formatedQualities.find((i) => i.id === id)
    for (const quality of qualityLevels.levels_) {
      if (quality.id !== id) {
        quality.enabled = false
      } else {
        quality.enabled = true
      }
    }

    qualityLevels.selectedIndex_ = found?.index
    qualityLevels.trigger({ type: 'change', selectedIndex: found?.index })
  }

  class CustomMenuButton extends MenuButton {
    options_: any
    player: any
    createItems() {
      const player = this.player()

      return this.options_.items.map((item: { name: string }) => {
        const qualitySelectorButton = new MenuItem(player, { label: item.name })

        qualitySelectorButton.handleClick = (data) => {
          const qualityClicked = data.currentTarget.innerText
          const id = formatedQualities.find((i) => i.name === qualityClicked)?.id

          if (id) {
            setQuality(id)
          }
        }

        // set quality on startup
        const startingQuality = getSetting('defaultQuality')
        const id = formatedQualities.find((i) => i.name.includes(startingQuality))?.id
        setQuality(id)

        return qualitySelectorButton
      })
    }

    buildCSSClass() {
      return `vjs-icon-cog ${super.buildCSSClass()}`
    }
  }
  videojs.registerComponent('CustomMenuButton', CustomMenuButton)
  const formattedLevels = []

  const updateLevels = () => {
    player.controlBar.removeChild('CustomMenuButton')
    player.controlBar.addChild('CustomMenuButton', {
      title: t('player.quality'),
      items: formatedQualities
    })
  }

  qualityLevels.on('addqualitylevel', () => {
    formatedQualities = qualityLevels.levels_.map((quality: QualityLevel) => {
      let qualityFramerate = ''

      if (quality.frameRate > 30) {
        qualityFramerate = quality.frameRate
      }

      return {
        name: quality.height?.toString() + 'p' + qualityFramerate,
        index: quality.id[0],
        id: quality.id
      }
    })

    // remove audio only
    const audioOnlyQuality = formatedQualities[formatedQualities.length - 1]
    if (audioOnlyQuality.name === 'undefinedp') {
      formatedQualities.splice(formatedQualities.length - 1, 1)
    }

    formattedLevels.push(formatedQualities)
    updateLevels()
  })
}
