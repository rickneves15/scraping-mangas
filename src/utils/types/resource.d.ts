import { Serie } from './models'

interface Resource {
  series(series: Serie[]): Serie[]
}

export { Resource }
