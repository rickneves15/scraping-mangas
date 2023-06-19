import inquirer, { QuestionCollection } from 'inquirer'

export type chapterRangePromptAnswers = {
  chapterRange: boolean
}

const chapterRangePrompt = (): Promise<chapterRangePromptAnswers> => {
  const promptQuestions: QuestionCollection<chapterRangePromptAnswers> = [
    {
      type: 'confirm',
      name: 'chapterRange',
      message: 'Do you want to download all chapters?',
      default: true,
    },
  ]

  return inquirer.prompt<chapterRangePromptAnswers>(promptQuestions)
}

export { chapterRangePrompt }
