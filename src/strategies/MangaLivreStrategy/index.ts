import MangaLivreService from '../../services/MangaLivreService'
import { SourceStrategy } from './../../utils/types/strategies'
import { Serie } from '../../utils/types/models'

class MangaLivreStrategy implements SourceStrategy {
  public source: string = 'MangaLivre'

  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly service = new MangaLivreService()) {}

  // @ts-ignore
  search(search: string): Promise<Serie[] | []> {
    return this.service.getSeries(search)
  }

  async chapterList(serie: Serie): Promise<String[] | Number[]> {
    const chapters = await this.service.getChapters(serie.id, serie.link)
    const chaptersList = chapters.map((chapter) => chapter.number)
    return chaptersList
  }

  async handleDownload(serie: Serie, chapterFrom: any, chapterTo: any) {
    const chapters = await this.service.getChapters(serie.id, serie.link)

    await this.service.download(
      serie,
      chapters.sort((a: any, b: any) => b.number - a.number),
      chapterFrom,
      chapterTo,
    )
  }
}

export default MangaLivreStrategy
