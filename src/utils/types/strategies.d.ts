import { Serie } from './models'

interface SourceStrategy {
  source: string
  search(search: string): Serie[]
  chapterList(serie: Serie): Promise<String[] | Number[]>
  handleDownload(
    serie: Serie,
    chapterMode: number,
    chapterFrom: number,
    chapterTo?: number,
  ): void
}

export { SourceStrategy }
