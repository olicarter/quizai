'use client'

import { PartySocket } from 'partysocket'
import usePartySocket from 'partysocket/react'
import { useEffect, useRef, useState } from 'react'
import { readableColor } from 'polished'
import {
  type ColorClass,
  EventType,
  type Player,
  type Quiz,
  colorClasses,
} from '@/types'
import { TextInput } from '@/components/TextInput'
import { Button } from '@/components/Button'
import { cn } from '@/utils/cn'
import { Loading } from '@/components/Loading'
import { SubmitButton } from '@/components/SubmitButton'

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

  return (
    <div className="flex flex-col gap-4">
      <h3 className="cursor-default font-bold text-2xl text-center text-pink">
        Enter your name
      </h3>
      <div className="bg-white flex rounded-full">
        <TextInput
          autoComplete="off"
          className="bg-transparent focus:ring-pink grow pl-6 rounded-r-none selection:bg-pink selection:text-amber-50"
          minLength={1}
          name="code"
          onChange={e => setName(e.target.value)}
          pattern="[A-Z0-9]{4}"
          placeholder="Name"
          required
          value={name}
        />
        <SubmitButton
          className="rounded-l-none"
          disabled={!name}
          onClick={async () => {
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
          }}
          type="button"
        >
          Continue
        </SubmitButton>
      </div>
    </div>
  )
}

function Lobby({ id, room }: { id: string; room: string }) {
  const [topic, setTopic] = useState('')
  const [quiz, setQuiz] = useState<Quiz>()

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
    id,
    room,
    onMessage(event) {
      const quiz = JSON.parse(event.data) as Quiz
      if (quiz) setQuiz(quiz)
    },
  })

  const sendTopic = () => {
    socket.send(JSON.stringify({ type: EventType.AddTopic, topic }))
    setTopic('')
  }

  if (!quiz) return null

  const currentPlayer = quiz.players.find(player => player.name === id)
  if (!currentPlayer) return null

  if (quiz.started && quiz.questions.length === 0) {
    return (
      <div className="flex flex-col gap-8 items-center">
        <div className="h-64 relative w-64">
          <Loading />
        </div>
        <h1 className="absolute animate-pulse cursor-default flex font-extrabold inset-0 items-center justify-center selection:bg-transparent text-sm text-pink">
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
      <div className="grid landscape:grid-cols-2 gap-4 grow w-full">
        <p className="font-bold text-2xl text-pink">{currentQuestion.text}</p>
        <ul className="flex flex-col gap-4">
          {currentQuestion.answers.map((answer, i) => {
            const playerHasAnswered =
              currentPlayer.name in currentQuestion.playerAnswers
            const selected =
              currentQuestion.playerAnswers[currentPlayer.name] === i
            const backgroundColor = `hsl(${(i * 60 + 340) % 360}deg, 100%, 60%)`
            const color = readableColor(backgroundColor)
            const opacity = !playerHasAnswered || selected ? 1 : 0.5
            return (
              <button
                className={cn(
                  'disabled:cursor-not-allowed font-semibold grow rounded-2xl text-lg text-white w-full',
                  selected && 'cursor-default',
                  !selected && 'enabled:hover:brightness-95',
                )}
                disabled={!selected && playerHasAnswered}
                key={i}
                onClick={() => {
                  socket.send(
                    JSON.stringify({ type: EventType.Answer, answerIndex: i }),
                  )
                }}
                style={{ backgroundColor, color, opacity }}
              >
                {answer.text}
              </button>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <div className="flex flex-col grow items-center justify-around max-w-md w-full">
      <div className="h-64 relative w-64">
        <Loading dots={quiz.players.map(player => player.colorClass)} />
        <h1 className="absolute cursor-default flex font-extrabold inset-0 items-center justify-center selection:bg-transparent text-5xl text-pink">
          {quiz.startingIn ? quiz.startingIn : quiz.code}
        </h1>
      </div>

      <ul className="flex flex-wrap gap-x-4 w-full">
        <h3 className="cursor-default font-extrabold text-xl text-pink/50 w-full">
          players
        </h3>
        {quiz.players.map(player => (
          <PlayerButton
            onChangeColorClass={colorClass => {
              socket.send(
                JSON.stringify({
                  type: EventType.ChangePlayerColorClass,
                  colorClass,
                  playerId: player.name,
                }),
              )
            }}
            key={player.name}
            player={player}
          />
        ))}
      </ul>

      <ul className="flex flex-wrap gap-x-4 w-full">
        <h3 className="cursor-default font-extrabold text-xl text-pink/50 w-full">
          topics
        </h3>
        {quiz.topics.map((topic, index) => (
          <li
            className="font-extrabold text-[hsl(40deg,100%,60%)] text-xl"
            key={topic}
            style={{ color: `hsl(${(index * 60 - 20) % 360}deg,100%,60%)` }}
          >
            {topic}
          </li>
        ))}
      </ul>

      <form
        className="bg-white flex h-16 overflow-hidden rounded-full w-full"
        onSubmit={e => {
          e.preventDefault()
          sendTopic()
        }}
      >
        <TextInput
          className="focus:ring-pink px-8 rounded-r-none text-left w-full"
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
      </form>

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

function PlayerButton(props: {
  onChangeColorClass: (colorClass: ColorClass) => void
  player: Player
}) {
  return (
    <button
      className="flex font-extrabold items-center justify-center outline-none rounded-full shrink-0 text-amber-50 text-xl"
      key={props.player.name}
      onClick={() => {
        const currentColorClassIndex = colorClasses.indexOf(
          props.player.colorClass,
        )
        const nextColorClassIndex =
          (currentColorClassIndex + 1) % colorClasses.length
        const nextColorClass = colorClasses[nextColorClassIndex]
        props.onChangeColorClass(nextColorClass)
      }}
      type="button"
    >
      <span
        className={cn('bg-clip-text text-transparent', props.player.colorClass)}
      >
        {props.player.name}
      </span>
    </button>
  )
}
