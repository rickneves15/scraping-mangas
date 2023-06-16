type MLSerieCategory = {
  id_category: number
  id_sub_domain: number | null
  domain: string
  name: string
  _joinData: {
    id_serie_category: number
    id_serie: number
    id_category: number
  }
}

type MLSerie = {
  id_serie: number
  name: string
  label: string
  score: string
  value: string
  author: string
  artist: string
  categories: MLSerieCategory[]
  cover: string
  cover_thumb: string
  cover_avif: string
  cover_thumb_avif: string
  link: string
  is_complete: boolean
}

type MLSerieChapterRelease = {
  id_release: number
  scanlators: {
    id_scanlator: number
    name: string
    link: string
  }[]
  views: number
  link: string
}

type MLSerieChapter = {
  id_serie: number
  id_chapter: number
  name: string
  chapter_name: string
  number: string
  date: string
  date_created: string
  releases: {
    [key: string]: MLSerieChapterRelease
  }
  seasonAnimeFinished: null
  officialLink: null
  predictionDate: null
  predictionDateToCalc: null
  serieFirstChapter: string
  officialSerieLink: null
}

type MLUrlImagesChapter = {
  legacy: string
  avif: string
}

export { MLSerie, MLSerieCategory, MLUrlImagesChapter, MLSerieChapter }
