export interface FindSerieEpisodeDTO {
  id: string
  url: string
  episode: number
  name: string
}

export interface CheckWithExistsNewChapterDto {
  id: string
  url: string
  cap: number
  name: string
}

export interface RefreshWorkScrappingStatusDto {
  workId: string
  status: 'success' | 'error'
  message?: string
}

export interface WorkNewChapterDto {
  nextChapter: number
  workId: string
}
