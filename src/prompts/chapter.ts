import inquirer, { QuestionCollection } from 'inquirer'

export type ChapterPromptAnswers = {
  chapterFrom: number
  chapterTo: number
}

const chapterPrompt = (chapterList: any): Promise<ChapterPromptAnswers> => {
  const promptQuestions: QuestionCollection<ChapterPromptAnswers> = [
    {
      type: 'list',
      name: 'chapterFrom',
      message: 'Select a chapter to download from:',
      choices: chapterList,
    },
    {
      type: 'list',
      name: 'chapterTo',
      message: 'Select a chapter to download to:',
      choices: chapterList,
    },
  ]

  return inquirer.prompt<ChapterPromptAnswers>(promptQuestions)
}

export { chapterPrompt }
