export const colorClasses = [
  'bg-rose-300',
  'bg-amber-300',
  'bg-green-300',
  'bg-cyan-300',
  'bg-indigo-300',
  'bg-fuchsia-300',
]

export enum Difficulty {
  Easy = 'fairly easy',
  Hard = 'extremely difficult',
}

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
