import type { Badge } from './types'

export function getBadges(badges: Badge[], badgesToFind: { setId: string; version: string }[]) {
  const foundBadges = []
  if (!badges) return

  for (const badgeToFind of badgesToFind) {
    const badge = badges
      .filter((badge) => badge.setId === badgeToFind.setId)
      .find((badge) => badge.version === badgeToFind.version)

    if (badge) {
      foundBadges.push(badge)
    }
  }

  return foundBadges
}

export const getBadgesFromMessage = (tags: any, allBadges: Badge[]) => {
  const badgesString = tags.badges
  if (!badgesString) return
  const badges = badgesString.split(',')
  const formatedBadges = badges.map((badgeWithVersion: string) => {
    const [setId, version] = badgeWithVersion.split('/')
    return { setId, version }
  })

  return getBadges(allBadges, formatedBadges)
}
