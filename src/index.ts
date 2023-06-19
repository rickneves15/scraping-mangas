/* eslint-disable n/no-path-concat */
import dotenv from 'dotenv'
import SourceManager from './SourceManager'
import { searchPrompt, SearchPromptAnswers } from './prompts/search'
import { seriePrompt, SeriePromptAnswers } from './prompts/serie'
import { chapterPrompt } from './prompts/chapter'
import { Serie } from './utils/types/models'

dotenv.config()

const sourceManager = new SourceManager()

searchPrompt()
  .then(async (answers: SearchPromptAnswers) => {
    sourceManager.setSource(answers.source)
    const series: Serie[] = await sourceManager.getSeries(answers.search)

    if (!series) {
      console.info('Searhing is not available')
      return
    }

    seriePrompt(series).then(async (answers: SeriePromptAnswers) => {
      const serie = series.find((serie) => serie.id === answers.serieId)

      if (serie) {
        sourceManager.setSerie(serie)
        const chapters = await sourceManager.chapters()

        chapterPrompt(chapters.sort((a, b) => a - b)).then(
          async (answers: any) => {
            await sourceManager.download(answers.chapterSelected)
          },
        )
      }
    })
  })
  .catch((error: Error) => {
    console.error('Error:', error)
  })
