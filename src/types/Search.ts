import type { StreamerData } from './'
import type { CategoryPreview } from './'

export interface SearchResult {
  channels: StreamerData[]
  categories: CategoryPreview[]
  relatedChannels: StreamerData[]
  channelsWithTag: StreamerData[]
}
