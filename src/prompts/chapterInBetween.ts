import inquirer, { QuestionCollection } from 'inquirer'

export type chapterPromptInBetweenAnswers = {
  chapterFrom: number
}

const chapterPromptInBetween = (
  chapterList: any,
): Promise<chapterPromptInBetweenAnswers> => {
  const promptQuestions: QuestionCollection<chapterPromptInBetweenAnswers> = [
    {
      type: 'list',
      name: 'chapterFrom',
      message: 'Select a chapter to download from:',
      choices: chapterList,
    },
  ]

  return inquirer.prompt<chapterPromptInBetweenAnswers>(promptQuestions)
}

export { chapterPromptInBetween }
