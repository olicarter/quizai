import type * as Party from 'partykit/server'
import OpenAI from 'openai'
import {
  colors,
  EventType,
  type ConnectionState,
  Difficulty,
  type Player,
  type Question,
  type Quiz,
  type Topic,
  OpenAIGenerateQuestionsContent,
} from '@/types'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {
    this.openai = new OpenAI({
      apiKey:
        (this.room.env['OPENAI_API_KEY'] as string) ??
        process.env.OPENAI_API_KEY,
    })
  }

  openai: OpenAI | null = null
  players = new Map<Party.Connection['id'], Player>()
  quiz: Quiz | undefined
  topics = new Set<Topic>()
  timeout: NodeJS.Timeout | null = null

  async onConnect(connection: Party.Connection<ConnectionState>) {
    console.log('onConnect', this.quiz)
    if (!this.quiz) return
    // if (!this.quiz) {
    //   // throw Error('No quiz found')
    //   this.quiz = {
    //     code: this.room.id,
    //     complete: false,
    //     currentQuestionIndex: 0,
    //     difficulty: Difficulty.Hard,
    //     players: [],
    //     questions: [],
    //     started: false,
    //     startingIn: null,
    //     topics: [],
    //   }
    //   await this.room.storage.put<Quiz>('quiz', this.quiz)
    // }
    console.log(connection)
    console.log(this.quiz)
    if (!this.players.has(connection.id)) {
      this.players.set(connection.id, {
        color: colors[0],
        name: connection.id,
        ready: false,
      })
    }
    this.quiz.players = Array.from(this.players.values())
    this.room.broadcast(JSON.stringify(this.quiz))
  }

  async onMessage(message: string, sender: Party.Connection<ConnectionState>) {
    if (!this.quiz) return

    const event = JSON.parse(message)

    switch (event.type) {
      // case EventType.AddTopic: {
      //   this.topics.add(event.topic)
      //   this.quiz.topics = Array.from(this.topics)
      //   this.room.broadcast(JSON.stringify(this.quiz))
      //   break
      // }
      case EventType.Answer: {
        const currentQuestion =
          this.quiz.questions[this.quiz.currentQuestionIndex]
        // Record the player's answer
        currentQuestion.playerAnswers[sender.id] = event.answerIndex
        // const currentQuestionAnsweredByAllPlayers =
        //   Object.keys(currentQuestion.playerAnswers).length ===
        //   this.players.size
        // if (currentQuestionAnsweredByAllPlayers) {
        //   if (this.quiz.currentQuestionIndex < this.quiz.questions.length - 1) {
        //     this.quiz.currentQuestionIndex++
        //   } else {
        //     this.quiz.complete = true
        //   }
        // }
        this.room.broadcast(JSON.stringify(this.quiz))
        break
      }
      case EventType.ChangePlayerColor: {
        const player = this.players.get(event.playerId)
        if (!player) return
        this.players.set(event.playerId, {
          ...player,
          color: event.color,
        })
        this.quiz.players = Array.from(this.players.values())
        this.room.broadcast(JSON.stringify(this.quiz))
        break
      }
      case EventType.NextQuestion: {
        if (this.quiz.currentQuestionIndex < this.quiz.questions.length - 1) {
          this.quiz.currentQuestionIndex++
        } else {
          this.quiz.complete = true
        }
        this.quiz.showQuestionResults = false
        this.room.broadcast(JSON.stringify(this.quiz))
        break
      }
      case EventType.Ready: {
        const player = this.players.get(sender.id)
        if (!player) return
        this.players.set(sender.id, { ...player, ready: event.ready })
        this.quiz.players = Array.from(this.players.values())
        if (this.quiz.players.every(player => player.ready)) {
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
      }
      case EventType.Start: {
        if (!this.quiz.players.every(player => player.ready)) {
          console.log("Can't start quiz until all players are ready")
          return
        }

        this.quiz.started = true
        this.room.broadcast(JSON.stringify(this.quiz))
        break
      }
      case EventType.ViewResults: {
        if (!this.quiz) return
        this.quiz.showQuestionResults = true
        this.room.broadcast(JSON.stringify(this.quiz))
        break
      }
    }

    await this.room.storage.put<Quiz>('quiz', this.quiz)
  }

  async onRequest(req: Party.Request) {
    const url = new URL(req.url)
    const pathnameSegments = url.pathname.slice(1).split('/')
    const path = pathnameSegments[2]

    if (req.method === 'GET' && path === 'connection') {
      const id = pathnameSegments[3]
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

    if (req.method === 'POST' && path === 'create') {
      type Body = Partial<{
        difficulty: Difficulty
        questionsCount: number
        topics: string[]
      }>
      const body = await req.json<Body>()
      if (
        !body.difficulty ||
        !body.questionsCount ||
        !body.topics ||
        body.topics.length === 0
      ) {
        return new Response('Missing required parameters', {
          headers: corsHeaders,
          status: 400,
        })
      }
      this.quiz = {
        code: this.room.id,
        complete: false,
        currentQuestionIndex: 0,
        difficulty: body.difficulty,
        players: [],
        questions: [],
        questionsCount: body.questionsCount,
        showQuestionResults: false,
        started: false,
        startingIn: null,
        topics: body.topics.map(topic => ({ color: 'fuchsia', name: topic })),
      }
      this.generateTopicsAndQuestions()
      return new Response(JSON.stringify(this.quiz), {
        headers: corsHeaders,
        status: 200,
      })
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
    // if (storedQuiz?.topics) this.topics = new Set(storedQuiz.topics)
    if (storedQuiz?.players)
      this.players = new Map(
        storedQuiz.players.map(player => [player.name, player]),
      )
  }

  async assignColorsToTopics(topics: Topic[]): Promise<Topic[]> {
    if (!this.openai) {
      console.error('assignColorsToTopics: OpenAI not initialized')
      return []
    }
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Given these topic colors \`[{name:"arts and literature",color:"rose"},{name:"sports",color:"amber"},{name:"history",color:"green"},{name:"science and nature",color:"cyan"},{name:"geography",color:"indigo"},{name:"miscellaneous",color:"fuchsia"}]\`, assign colors to these topics: ${topics
            .map(topic => topic.name)
            .join(
              ', ',
            )}. Respond in JSON in this format: { topics: { color: string, name: string }[] }.`,
        },
      ],
      model: 'gpt-4-turbo-preview',
      response_format: { type: 'json_object' },
    })
    return JSON.parse(completion.choices[0].message.content ?? '[]')
      .topics as Topic[]
  }

  async generateQuizQuestions(): Promise<Question[]> {
    if (!this.quiz) {
      console.error('generateQuizQuestions: No quiz found')
      return []
    }
    if (!this.openai) {
      console.error('generateQuizQuestions: OpenAI not initialized')
      return []
    }
    const topicsCSV = this.quiz.topics.map(topic => topic.name).join(', ')
    const prompt = `Generate ${this.quiz.difficulty} questions about these topics: ${topicsCSV}. Each question should have 3 wrong and 1 correct answer. There should be ${this.quiz.questionsCount} questions in total. The response should be a JSON object in the format \`{ questions: { text: string, answers: { correct: boolean, text: string }[], topic: string }[] }\`.`
    console.log('prompt', prompt)
    const completion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4-turbo-preview',
      response_format: { type: 'json_object' },
    })
    console.log('completion', completion)
    const content = JSON.parse(
      completion.choices[0].message.content ?? '{}',
    ) as OpenAIGenerateQuestionsContent

    if (!Array.isArray(content.questions)) {
      console.error('generateQuizQuestions: Invalid response from OpenAI')
      return []
    }

    return content.questions.map(question => {
      if (!this.quiz) throw Error('No quiz')
      const topic = this.quiz.topics.find(
        topic => topic.name === question.topic,
      )
      if (!topic) throw Error('No topic')
      return {
        ...question,
        playerAnswers: {},
        topic: {
          color: topic.color,
          name: question.topic,
        },
      }
    })
  }

  async generateTopicsAndQuestions() {
    if (!this.quiz) return
    this.room.broadcast(JSON.stringify(this.quiz))
    this.quiz.topics = await this.assignColorsToTopics(this.quiz.topics)
    this.room.broadcast(JSON.stringify(this.quiz))
    this.quiz.questions = await this.generateQuizQuestions()
    this.room.broadcast(JSON.stringify(this.quiz))
    await this.room.storage.put<Quiz>('quiz', this.quiz)
  }
}
