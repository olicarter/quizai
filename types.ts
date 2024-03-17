export const colors = ['rose', 'amber', 'green', 'cyan', 'indigo', 'fuchsia']

export enum Difficulty {
  Easy = 'fairly easy',
  Hard = 'extremely difficult',
}

export enum EventType {
  AddTopic = 'add-topic',
  Answer = 'answer',
  ChangePlayerColor = 'change-player-color',
  NextQuestion = 'next-question',
  Ready = 'ready',
  Start = 'start',
  ViewResults = 'view-results',
}

export type Answer = {
  correct: boolean
  text: string
}

export type Color = (typeof colors)[number]

export type ConnectionState = { ready: boolean }

export type OpenAIGenerateQuestionsContent = {
  questions: {
    answers: Answer[]
    text: string
    topic: string
  }[]
}

export type Player = {
  color: Color
  name: string
  ready: boolean
}

export type PlayerAnswer = {
  answerIndex: string
  playerName: Player['name']
}

export type Question = {
  answers: Answer[]
  playerAnswers: Record<Player['name'], number>
  text: string
  topic: Topic
}

export type Quiz = {
  code: string
  complete: boolean
  currentQuestionIndex: number
  difficulty: Difficulty
  players: Player[]
  questions: Question[]
  questionsCount: number
  showQuestionResults: boolean
  started: boolean
  startingIn: number | null
  topics: Topic[]
}

export type Topic = {
  color: Color
  name: string
}

export const defaultDifficulty = Difficulty.Hard
