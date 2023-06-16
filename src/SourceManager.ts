import MangaLivreStrategy from './strategies/MangaLivreStrategy'
import { Serie } from './utils/types/models'
import { SourceStrategy } from './utils/types/strategies'

type Source = {
  name: string
  strategy: SourceStrategy
}

class SourceManager {
  private sources: Source[]
  private source: string | undefined
  private serie!: Serie

  constructor() {
    // @ts-ignore
    this.sources = [{ name: 'MangaLivre', strategy: new MangaLivreStrategy() }]
  }

  setSource(source: string): void {
    this.source = source
  }

  getSourcesName() {
    return this.sources.map((obj) => obj.name)
  }

  private getStrategy() {
    const strategies = this.sources.map((obj) => obj.strategy)
    const strategy = strategies.find((s) => s.source === this.source)
    return strategy
  }

  getSeries(search: string): Serie[] | [] {
    const strategy = this.getStrategy()

    if (strategy) {
      return strategy.search(search)
    }

    return []
  }

  setSerie(serie: Serie): void {
    this.serie = serie
  }

  getSerie(): Serie | null {
    if (!this.serie) {
      return null
    }
    return this.serie
  }

  async chapters() {
    const serie: Serie | null = this.getSerie()
    const strategy = this.getStrategy()
    let chaptersList: any[] = []

    if (serie) {
      if (strategy) {
        chaptersList = await strategy.chapterList(serie)
      }
    }

    return chaptersList.reverse()
  }

  download(chapterSelected: any) {
    const serie: Serie | null = this.getSerie()

    if (serie) {
      const strategy = this.getStrategy()

      if (strategy) {
        strategy.handleDownload(serie, chapterSelected)
      }
    }
  }
}

export default SourceManager
