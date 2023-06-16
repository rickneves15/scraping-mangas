import inquirer, { QuestionCollection } from 'inquirer'
import SourceManager from '../SourceManager'

export type SearchPromptAnswers = {
  source: string
  search: string
}

const searchPrompt = (): Promise<SearchPromptAnswers> => {
  const sourceManager = new SourceManager()

  const choices: string[] = sourceManager.getSourcesName()

  const promptQuestions: QuestionCollection<SearchPromptAnswers> = [
    {
      type: 'list',
      name: 'source',
      message: 'Choose a source to download:',
      choices,
    },
    {
      type: 'input',
      name: 'search',
      message: 'Enter the name of the series you are searching for:',
      validate: (input) => {
        if (input.trim().length === 0) {
          return 'Please enter a valid series name.'
        }
        return true
      },
    },
  ]

  return inquirer.prompt<SearchPromptAnswers>(promptQuestions)
}

export { searchPrompt }
