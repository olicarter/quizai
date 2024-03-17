'use client'

import { PartySocket } from 'partysocket'
import usePartySocket from 'partysocket/react'
import { useEffect, useRef, useState } from 'react'
import { readableColor } from 'polished'
import { colors, EventType, type Color, type Player, type Quiz } from '@/types'
import { TextInput } from '@/components/TextInput'
import { Button } from '@/components/Button'
import { cn } from '@/utils/cn'
import { Loading } from '@/components/Loading'
import { SubmitButton } from '@/components/SubmitButton'
import { Badge } from '@/components/Badge'

export default function QuizPage({
  params: { code },
}: {
  params: { code: string }
}) {
  const localStorageKey = `quizai.${code}.id`
  const [id, setId] = useState<string | null | undefined>()
  const [name, setName] = useState(id ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setId(localStorage.getItem(localStorageKey))
  }, [localStorageKey])

  if (id === undefined) {
    return <p className="animate-pulse opacity-0 text-center">Loading...</p>
  }

  if (id) return <Lobby id={id} room={code} />

  const submitName = async () => {
    const { status } = await PartySocket.fetch(
      {
        host: process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
        room: code,
        path: `connection/${name}`,
      },
      { method: 'GET' },
    )
    if (status === 404) {
      localStorage.setItem(localStorageKey, name)
      setId(name)
    } else {
      inputRef.current?.setCustomValidity('Name already taken')
      inputRef.current?.reportValidity()
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="cursor-default font-bold text-2xl text-center">
        Enter your name
      </h3>
      <div className="bg-white border-4 border-rose-500 flex rounded-full w-full">
        <TextInput
          autoComplete="off"
          autoFocus
          className="bg-transparent border-0 focus:ring-0 ring-0 grow pl-4 rounded-r-none selection:bg-rose-400 selection:text-white w-0"
          minLength={1}
          name="name"
          onChange={e => setName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submitName()
            }
          }}
          pattern="[A-Z0-9]{4}"
          placeholder="Name"
          required
          value={name}
        />
        <SubmitButton
          className="border-4 border-white"
          disabled={!name}
          onClick={submitName}
          type="button"
        >
          Continue
        </SubmitButton>
      </div>
    </div>
  )
}

function Lobby({ id, room }: { id: string; room: string }) {
  // const [topic, setTopic] = useState('')
  const [quiz, setQuiz] = useState<Quiz>()

  console.log(quiz)

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
    id,
    room,
    onMessage(event) {
      const quiz = JSON.parse(event.data) as Quiz
      if (quiz) setQuiz(quiz)
    },
  })

  // const sendTopic = () => {
  //   socket.send(JSON.stringify({ type: EventType.AddTopic, topic }))
  //   setTopic('')
  // }

  if (!quiz) return null

  const currentPlayer = quiz.players.find(player => player.name === id)
  if (!currentPlayer) return null

  if (quiz.started && quiz.questions.length === 0) {
    return (
      <div className="flex flex-col gap-8 items-center">
        <div className="h-64 relative w-64">
          <Loading />
        </div>
        <h1 className="absolute animate-pulse cursor-default flex font-extrabold inset-0 items-center justify-center selection:bg-transparent text-sm text-rose-400">
          Generating
        </h1>
      </div>
    )
  }

  if (quiz.complete) {
    return (
      <div>
        <p>Quiz complete!</p>
        {/* Questions list indicating who answered what */}
        <ul>
          {quiz.questions.map((question, i) => (
            <li key={i}>
              <p>{question.text}</p>
              <ul>
                {question.answers.map((answer, j) => (
                  <li
                    className={cn(answer.correct && 'text-green-600')}
                    key={j}
                  >
                    {answer.text} -{' '}
                    {Object.entries(question.playerAnswers)
                      .filter(([, answerIndex]) => answerIndex === j)
                      .map(([playerName]) => playerName)
                      .join(', ')}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (quiz.started && quiz.questions.length > 0) {
    const currentQuestion = quiz.questions[quiz.currentQuestionIndex]
    if (!currentQuestion) throw Error('No current question')
    return (
      <div className="flex flex-col grow items-stretch justify-between w-full">
        <header className="flex flex-col gap-4">
          <div className="flex gap-4">
            <span className="font-extrabold text-2xl">
              {quiz.currentQuestionIndex + 1}/{quiz.questions.length}
            </span>
            <Badge color={currentQuestion.topic.color}>
              {currentQuestion.topic.name}
            </Badge>
          </div>
          <p className="font-extrabold text-2xl">{currentQuestion.text}</p>
        </header>
        <div className="flex flex-col gap-8">
          <ul className="flex flex-wrap gap-2">
            {quiz.players.map(player => (
              <Badge
                color={player.color}
                key={player.name}
                showCheck={player.name in currentQuestion.playerAnswers}
              >
                {player.name}
              </Badge>
            ))}
          </ul>
          <ul className="flex flex-col gap-4">
            {currentQuestion.answers.map((answer, i) => {
              const playerHasAnswered =
                currentPlayer.name in currentQuestion.playerAnswers
              const selected =
                currentQuestion.playerAnswers[currentPlayer.name] === i
              const opacity = !playerHasAnswered || selected ? 1 : 0.5
              return (
                <button
                  className={cn(
                    'disabled:cursor-not-allowed font-semibold grow p-4 rounded-2xl text-lg w-full',
                    selected && 'cursor-default',
                    {
                      'bg-rose-300 hover:bg-rose-400':
                        (!playerHasAnswered || selected) &&
                        currentQuestion.topic.color === 'rose',
                      'bg-rose-100 hover:bg-rose-200':
                        playerHasAnswered &&
                        !selected &&
                        currentQuestion.topic.color === 'rose',
                      'bg-amber-300 hover:bg-amber-400':
                        (!playerHasAnswered || selected) &&
                        currentQuestion.topic.color === 'amber',
                      'bg-amber-100 hover:bg-amber-200':
                        playerHasAnswered &&
                        !selected &&
                        currentQuestion.topic.color === 'amber',
                      'bg-green-300 hover:bg-green-400':
                        (!playerHasAnswered || selected) &&
                        currentQuestion.topic.color === 'green',
                      'bg-green-100 hover:bg-green-200':
                        playerHasAnswered &&
                        !selected &&
                        currentQuestion.topic.color === 'green',
                      'bg-cyan-300 hover:bg-cyan-400':
                        (!playerHasAnswered || selected) &&
                        currentQuestion.topic.color === 'cyan',
                      'bg-cyan-100 hover:bg-cyan-200':
                        playerHasAnswered &&
                        !selected &&
                        currentQuestion.topic.color === 'cyan',
                      'bg-indigo-300 hover:bg-indigo-400':
                        (!playerHasAnswered || selected) &&
                        currentQuestion.topic.color === 'indigo',
                      'bg-indigo-100 hover:bg-indigo-200':
                        playerHasAnswered &&
                        !selected &&
                        currentQuestion.topic.color === 'indigo',
                      'bg-fuchsia-300 hover:bg-fuchsia-400':
                        (!playerHasAnswered || selected) &&
                        currentQuestion.topic.color === 'fuchsia',
                      'bg-fuchsia-100 hover:bg-fuchsia-200':
                        playerHasAnswered &&
                        !selected &&
                        currentQuestion.topic.color === 'fuchsia',
                    },
                  )}
                  disabled={!selected && playerHasAnswered}
                  key={i}
                  onClick={() => {
                    socket.send(
                      JSON.stringify({
                        type: EventType.Answer,
                        answerIndex: i,
                      }),
                    )
                  }}
                  style={{ opacity }}
                >
                  {answer.text}
                </button>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 grow items-stretch max-w-md w-full">
      <div className="flex flex-col grow items-center justify-center">
        <div className="h-64 relative w-64">
          <Loading dots={quiz.players.map(player => player.color)} />
          <h1 className="absolute cursor-default flex font-extrabold inset-0 items-center justify-center selection:bg-transparent text-5xl text-rose-500">
            {quiz.startingIn ? quiz.startingIn : quiz.code}
          </h1>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h3 className="cursor-default font-extrabold leading-none text-2xl">
          Players
        </h3>
        <ul className="flex flex-wrap gap-2">
          {quiz.players.map(player => (
            <Badge
              color={player.color}
              key={player.name}
              onClick={() => {
                const currentColorClassIndex = colors.indexOf(player.color)
                const nextColorClassIndex =
                  (currentColorClassIndex + 1) % colors.length
                const nextColorClass = colors[nextColorClassIndex]
                socket.send(
                  JSON.stringify({
                    type: EventType.ChangePlayerColor,
                    color: nextColorClass,
                    playerId: player.name,
                  }),
                )
              }}
              showCheck={player.ready}
            >
              {player.name}
            </Badge>
          ))}
        </ul>
      </section>

      <ul className="flex flex-col gap-4">
        <h3 className="cursor-default font-extrabold leading-none text-2xl">
          Topics
        </h3>
        <ul className="flex flex-wrap gap-2">
          {quiz.topics.map(topic => (
            <Badge color={topic.color} key={topic.name}>
              {topic.name}
            </Badge>
          ))}
        </ul>
      </ul>

      {/* <form
        className="bg-white flex h-16 overflow-hidden rounded-full w-full"
        onSubmit={e => {
          e.preventDefault()
          sendTopic()
        }}
      >
        <TextInput
          className="focus:ring-rose-400 px-8 rounded-r-none text-left w-full"
          disabled={quiz.topics.length >= 5}
          minLength={3}
          onChange={e => {
            if (e.target.value === ' ') return
            setTopic(e.target.value)
          }}
          value={topic}
        />
        <Button className="rounded-l-none" disabled={quiz.topics.length >= 5}>
          Add topic
        </Button>
      </form> */}

      <Button
        className="w-full"
        onClick={() => {
          socket.send(
            JSON.stringify({
              type: EventType.Ready,
              ready: !currentPlayer.ready,
            }),
          )
        }}
      >
        {currentPlayer.ready ? 'Not ready' : 'Ready'}
      </Button>
    </div>
  )
}
