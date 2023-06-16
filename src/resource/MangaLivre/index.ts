import { BASE_URL } from '../../services/MangaLivreService/constants'
import { Serie } from '../../utils/types/models'
import { Resource } from '../../utils/types/resource'
import { MLSerie } from '../../utils/types/sources/MangaLivre/type'

class MangaLivreResource implements Resource {
  // @ts-ignore
  series(series: MLSerie[]): Serie[] {
    const seriesResource: Serie[] = []
    for (const serie of series) {
      seriesResource.push({
        id: serie.id_serie,
        name: serie.name,
        imageCover: serie.cover,
        link: BASE_URL + serie.link,
      })
    }
    return seriesResource
  }
}
export default MangaLivreResource
