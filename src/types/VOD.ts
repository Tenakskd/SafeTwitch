import type { StreamerData } from './Streamer'

export interface MinifiedCategory {
  image: string
  id: string
  name: string
  displayName: string
}

export interface MinifiedStreamer {
  name: string
  login: string
  pfp: string
  colorHex: string
}

export interface Video {
  type: 'vod' | 'clip'
  preview: string
  game: MinifiedCategory
  duration: number
  title: string
  publishedAt: string
  views: number
  tag: string[]
  streamer: StreamerData
  id: string
}

export interface Shelve {
  title: string
  videos: Video[]
}

export interface VodMessager {
  name: string
  login: string
}

export interface VodCommentBadge {
  version: number
  setId: string
}

export interface VodComment {
  message: string
  messager: MinifiedStreamer
  offset: number
  cursor: string
  badges: VodCommentBadge[]
}
