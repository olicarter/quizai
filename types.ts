export const colorClasses = [
  'bg-orange',
  'bg-green',
  'bg-cyan',
  'bg-blue',
  'bg-violet',
  'bg-pink',
]

export enum EventType {
  AddTopic = 'add-topic',
  Answer = 'answer',
  ChangePlayerColorClass = 'change-player-color-class',
  Ready = 'ready',
  Start = 'start',
}

export type Answer = {
  correct: boolean
  text: string
}

export type ColorClass = (typeof colorClasses)[number]

export type ConnectionState = { ready: boolean }

export type Player = {
  colorClass: ColorClass
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
