import inquirer, { QuestionCollection } from 'inquirer'
import { Serie } from '../utils/types/models'

export type SeriePromptAnswers = {
  serieId: number
}

const seriePrompt = (serieList: any): Promise<SeriePromptAnswers> => {
  const promptQuestions: QuestionCollection<SeriePromptAnswers> = [
    {
      type: 'list',
      name: 'serieId',
      message: 'Choose the series you want to download ?',
      choices: serieList.map(({ name, id: value }: Serie) => ({
        name,
        value,
      })),
    },
  ]

  return inquirer.prompt<SeriePromptAnswers>(promptQuestions)
}

export { seriePrompt }
