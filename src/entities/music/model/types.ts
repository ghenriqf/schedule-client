export interface MusicResponse {
  id: number
  ministryId: number
  title: string
  artist: string
  tone: string
  videoLink?: string
  chordSheetLink?: string
}

export interface MusicRequest {
  title: string
  artist: string
  tone: string
  videoLink?: string
  chordSheetLink?: string
}