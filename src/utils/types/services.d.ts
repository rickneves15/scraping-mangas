import { Serie } from './models'

interface Service {
  getSeries(search: string): Promise<Serie[] | undefined>
}

export { Service }
