import inquirer, { QuestionCollection } from 'inquirer'

export type ChapterPromptAnswers = {
  chapterSelected: number[] | string[]
}

const chapterPrompt = (chapterList: any): Promise<ChapterPromptAnswers> => {
  const promptQuestions: QuestionCollection<ChapterPromptAnswers> = [
    {
      type: 'list',
      name: 'chapterSelected',
      message: 'Select a chapter to download from:',
      suggestOnly: true,
      emptyText: 'Nothing found!',
      pageSize: 4,
      choices: chapterList,
      filter: (input: any) => {
        const filteredChoices = chapterList.filter((chapter: any) =>
          chapter.toString().includes(input),
        )
        return filteredChoices
      },
    },
  ]

  return inquirer.prompt<ChapterPromptAnswers>(promptQuestions)
}

export { chapterPrompt }
