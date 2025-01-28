export type Tag = string

export interface CategoryPreview {
  name: string
  displayName: string
  viewers: number
  tags: Tag[]
  createdAt?: Date
  cursor?: string
  image: string
}
