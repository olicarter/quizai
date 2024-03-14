export enum EventType {
  AddTopic = 'add-topic',
  Answer = 'answer',
  Ready = 'ready',
  Start = 'start',
}

export type Answer = {
  correct: boolean
  text: string
}

export type ConnectionState = { ready: boolean }

export type Player = {
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
