/* eslint-disable n/no-path-concat */
import dotenv from 'dotenv'
import SourceManager from './SourceManager'
import { searchPrompt, SearchPromptAnswers } from './prompts/search'
import { seriePrompt, SeriePromptAnswers } from './prompts/serie'
import { chapterPrompt, ChapterPromptAnswers } from './prompts/chapter'
import { Serie } from './utils/types/models'
import {
  chapterRangePrompt,
  chapterRangePromptAnswers,
} from './prompts/chapterRange'

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
        chapterRangePrompt().then(
          async (answers: chapterRangePromptAnswers) => {
            chapters.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
            const chapterFrom = Number(chapters[0])
            const chapterTo = Number(chapters[chapters.length - 1])

            if (answers.chapterRange) {
              await sourceManager.download(chapterFrom, chapterTo)
            } else {
              chapterPrompt(chapters).then(
                async (answers: ChapterPromptAnswers) => {
                  await sourceManager.download(
                    Number(answers.chapterFrom),
                    Number(answers.chapterTo),
                  )
                },
              )
            }
          },
        )
      }
    })
  })
  .catch((error: Error) => {
    console.error('Error:', error)
  })
