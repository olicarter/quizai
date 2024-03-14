import type * as Party from 'partykit/server'
import OpenAI from 'openai'
import {
  EventType,
  type ConnectionState,
  type Player,
  type Question,
  type Quiz,
} from '@/types'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  openai: OpenAI | undefined
  players = new Map<Party.Connection['id'], Player>()
  quiz: Quiz | undefined
  topics = new Set<string>()
  timeout: NodeJS.Timeout | null = null

  async onConnect(connection: Party.Connection<ConnectionState>) {
    if (!this.quiz) return
    if (!this.players.has(connection.id)) {
      this.players.set(connection.id, { name: connection.id, ready: false })
    }
    this.quiz.players = Array.from(this.players.values())
    this.room.broadcast(JSON.stringify(this.quiz))
  }

  async onMessage(message: string, sender: Party.Connection<ConnectionState>) {
    if (!this.quiz) return

    const event = JSON.parse(message)

    switch (event.type) {
      case EventType.AddTopic:
        this.topics.add(event.topic)
        this.quiz.topics = Array.from(this.topics)
        this.room.broadcast(JSON.stringify(this.quiz))
        break
      case EventType.Answer:
        this.quiz.questions[this.quiz.currentQuestionIndex].playerAnswers[
          sender.id
        ] = event.answerIndex
        // If the current question has been answered by all players
        if (
          Object.keys(
            this.quiz.questions[this.quiz.currentQuestionIndex].playerAnswers,
          ).length === this.players.size
        ) {
          if (this.quiz.currentQuestionIndex < this.quiz.questions.length - 1) {
            this.quiz.currentQuestionIndex++
          } else {
            this.quiz.complete = true
          }
        }
        this.room.broadcast(JSON.stringify(this.quiz))
        break
      case EventType.Ready:
        this.players.set(sender.id, { name: sender.id, ready: event.ready })
        this.quiz.players = Array.from(this.players.values())
        const allPlayersReady = this.quiz.players.every(player => player.ready)
        if (allPlayersReady) {
          this.quiz.startingIn = 5
          this.timeout = setInterval(() => {
            if (!this.quiz) return
            if (this.quiz.startingIn) this.quiz.startingIn--
            this.room.broadcast(JSON.stringify(this.quiz))
            if (this.quiz.startingIn === 0) {
              this.onMessage(JSON.stringify({ type: EventType.Start }), sender)
              if (this.timeout) clearInterval(this.timeout)
            }
          }, 1000)
        } else {
          if (this.timeout) clearInterval(this.timeout)
          this.quiz.startingIn = null
        }
        this.room.broadcast(JSON.stringify(this.quiz))
        break
      case EventType.Start:
        if (!this.quiz.players.every(player => player.ready)) return

        this.quiz.started = true
        this.room.broadcast(JSON.stringify(this.quiz))

        const topicsCSV = Array.from(this.topics.values()).join(', ')
        const prompt = `Generate difficult questions about these topics: ${topicsCSV}. Each question should have 3 wrong and 1 correct answer. There should be 2 questions in total. The response should be a JSON object in the format \`{ questions: { text: string, answers: { correct: boolean, text: string }[] }[] }\`.`
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
        const completion = await this.openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'gpt-4-turbo-preview',
          response_format: { type: 'json_object' },
        })
        console.log('completion', completion)
        const content = JSON.parse(
          completion.choices[0].message.content ?? '[]',
        ).questions as Question[]
        console.log('content', content)

        if (!Array.isArray(content)) return

        this.quiz.questions = content.map(question => ({
          ...question,
          playerAnswers: {},
        }))
        this.room.broadcast(JSON.stringify(this.quiz))
        break
    }

    await this.room.storage.put<Quiz>('quiz', this.quiz)
  }

  async onRequest(req: Party.Request) {
    if (req.method === 'POST') {
      this.quiz = {
        code: this.room.id,
        complete: false,
        currentQuestionIndex: 0,
        players: [],
        questions: [],
        started: false,
        startingIn: null,
        topics: [],
      }
      await this.room.storage.put<Quiz>('quiz', this.quiz)
    }

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const [, , path, id] = url.pathname.slice(1).split('/')
      if (path === 'connection') {
        if (id) {
          if (this.room.getConnection(id)) {
            return new Response(null, { headers: corsHeaders, status: 200 })
          } else {
            return new Response(null, { headers: corsHeaders, status: 404 })
          }
        } else {
          return new Response("Missing 'id' query parameter", {
            headers: corsHeaders,
            status: 400,
          })
        }
      }
    }

    if (this.quiz) {
      return new Response(JSON.stringify(this.quiz), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response('Not found', { headers: corsHeaders, status: 404 })
  }

  async onStart() {
    const storedQuiz = await this.room.storage.get<Quiz>('quiz')
    this.quiz = storedQuiz
    if (storedQuiz?.topics) this.topics = new Set(storedQuiz.topics)
    if (storedQuiz?.players)
      this.players = new Map(
        storedQuiz.players.map(player => [player.name, player]),
      )
  }
}
