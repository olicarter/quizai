export const colors = ['rose', 'amber', 'green', 'cyan', 'indigo', 'fuchsia']

export enum Difficulty {
  Easy = 'fairly easy',
  Hard = 'extremely difficult',
}

export enum EventType {
  AddTopic = 'add-topic',
  Answer = 'answer',
  ChangePlayerColor = 'change-player-color',
  Ready = 'ready',
  Start = 'start',
}

export type Answer = {
  correct: boolean
  text: string
}

export type Color = (typeof colors)[number]

export type ConnectionState = { ready: boolean }

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
}

export type Quiz = {
  code: string
  complete: boolean
  currentQuestionIndex: number
  players: Player[]
  questions: Question[]
  started: boolean
  startingIn: number | null
  topics: string[]
}
