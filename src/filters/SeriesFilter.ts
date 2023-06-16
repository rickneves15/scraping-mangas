/* eslint-disable no-useless-constructor */
import { mergeArrays } from '../utils'
import { MLSerie } from '../utils/types/sources/MangaLivre/type'

class SeriesFilter {
  constructor(
    private readonly series: MLSerie,
    private readonly search: string,
  ) {}

  public handle(): MLSerie[] {
    const filterSeriesByTitle = this.filterSeriesByTitle()
    const filterSeriesWordByWord = this.filterSeriesWordByWord()
    const filteredSeries: MLSerie[] = mergeArrays(
      filterSeriesByTitle,
      filterSeriesWordByWord,
      'id_serie',
    )

    return filteredSeries
  }

  private isStringSimilar(serie: string, search: string): boolean {
    const normalizedSerie = serie.toLowerCase().replace(/[^\w\s]/gi, '')
    const normalizedSearch = search.toLowerCase().replace(/[^\w\s]/gi, '')

    return normalizedSerie.includes(normalizedSearch)
  }

  private filterSeriesByTitle(): MLSerie[] {
    const series = this.series
    const search = this.search
    const filteredSeries: MLSerie[] = []

    if (!series) return []

    // @ts-ignore
    for (const serie of series) {
      if (this.isStringSimilar(serie.name, search)) {
        filteredSeries.push(serie)
      }
    }

    return filteredSeries
  }

  private filterSeriesWordByWord(): MLSerie[] {
    const series = this.series
    const search = this.search
    const searchTerms = search.split(' ')
    const filteredSeries: MLSerie[] = []

    if (!series) return []

    for (const searchTerm of searchTerms) {
      // @ts-ignore
      for (const serie of series) {
        if (serie.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          filteredSeries.push(serie)
        }
      }
    }

    return filteredSeries
  }
}

export default SeriesFilter
