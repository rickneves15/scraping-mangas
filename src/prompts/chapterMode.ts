import inquirer, { QuestionCollection } from 'inquirer'

export type chapterModePromptAnswers = {
  chapterMode: 1 | 2 | 3
}

export const CHAPTERS_MODE = {
  ALL: 1,
  FROM: 2,
  IN_BETWEEN: 3,
}

const chapterModePrompt = (): Promise<chapterModePromptAnswers> => {
  const promptQuestions: QuestionCollection<chapterModePromptAnswers> = [
    {
      type: 'list',
      name: 'chapterMode',
      message: 'What mode do you wish to download the chapters in?',
      choices: [
        { name: 'All', value: CHAPTERS_MODE.ALL },
        { name: 'From', value: CHAPTERS_MODE.FROM },
        { name: 'In Between', value: CHAPTERS_MODE.IN_BETWEEN },
      ],
    },
  ]

  return inquirer.prompt<chapterModePromptAnswers>(promptQuestions)
}

export { chapterModePrompt }
