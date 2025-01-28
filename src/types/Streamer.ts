export interface Social {
  type: string
  name: string
  url: string
}

export interface StreamData {
  tags: string[]
  title: string
  topic: string
  startedAt: number
  viewers: number
  preview: string
  cursor?: string
}

export interface StreamerData {
  username: string
  login: string
  followers: number
  isLive: boolean
  about: string
  socials?: Social[]
  pfp: string
  banner: string
  stream?: StreamData | null
  isPartner: boolean | null
  colorHex: string
  id: number
}

export interface FollowingStreamer {
  username: string
  login: string
  pfp: string
  followers: number
}
