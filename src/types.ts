interface Tag {
  title: string
  amountVideos: number
  slug: string
  id: string
}

export interface TagResponse {
  first: number
  prev: number | null
  next: number
  last: number
  pages: number
  items: number
  data: Tag[]
}
