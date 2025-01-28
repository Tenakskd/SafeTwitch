import type { Tag } from './'

export interface CategoryMinifiedStream {
  title: string
  viewers: number
  preview: string
  tags: Tag[]
  cursor: string
  streamer: {
    name: string
    pfp: string
    colorHex: string
  }
}

export interface CategoryData {
  name: string
  cover: string
  description: string
  viewers: number
  followers: number
  tags: Tag[]
  streams: CategoryMinifiedStream[]
}
