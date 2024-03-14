'use client'

import { PartySocket } from 'partysocket'
import usePartySocket from 'partysocket/react'
import { useEffect, useRef, useState } from 'react'
import { EventType, type Player, type Quiz } from '@/types'
import { TextInput } from '@/components/TextInput'
import { Button } from '@/components/Button'
import { cn } from '@/utils/cn'
import { Loading } from '@/components/Loading'

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

  if (!id) {
    return (
      <div className="flex flex-col gap-4 max-w-96 self-center w-full">
        <TextInput
          autoComplete="off"
          name="name"
          onChange={e => setName(e.target.value)}
          placeholder="name"
          ref={inputRef}
          required
          value={name}
        />
        <Button
          onClick={async e => {
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
        >
          Continue
        </Button>
      </div>
    )
  }

  return <Lobby id={id} room={code} />
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
        <Loading />
        <p
          className="animate-pulse font-semibold text-center"
          style={{ animationDuration: '3s' }}
        >
          generating questions
        </p>
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
      <div className="gap-4 grid grid-cols-2 grid-rows-3 h-full place-items-center">
        <p className="col-span-2 font-bold text-3xl text-center">
          {currentQuestion.text}
        </p>
        {currentQuestion.answers.map((answer, i) => (
          <button
            className={cn(
              'font-semibold h-full rounded-2xl text-lg w-full',
              currentQuestion.playerAnswers[currentPlayer.name] === i
                ? 'bg-rose-500 text-rose-50'
                : 'bg-rose-300 hover:bg-rose-400 text-rose-950',
            )}
            key={i}
            onClick={() => {
              socket.send(
                JSON.stringify({ type: EventType.Answer, answerIndex: i }),
              )
            }}
          >
            {answer.text}
          </button>
        ))}
      </div>
    )
  }

  return (
    <>
      <h1 className="col-span-2 font-bold text-5xl text-center">{room}</h1>

      {quiz.startingIn && <h3>Starting in {quiz.startingIn}</h3>}

      <div className="gap-4 grid grid-cols-2">
        <ul className="flex flex-wrap gap-4">
          {quiz.topics.map(topic => (
            <li
              className="bg-rose-50 flex font-semibold h-14 items-center px-4 rounded-full text-lg text-rose-500"
              key={topic}
            >
              {topic}
            </li>
          ))}
        </ul>

        <ul className="flex flex-wrap gap-4">
          {quiz.players.map(player => (
            <li
              className={cn(
                'flex font-semibold h-14 items-center justify-center min-w-14 px-4 rounded-full text-lg',
                player.ready
                  ? 'bg-green-500 text-green-50'
                  : 'bg-rose-50 text-rose-500',
              )}
              key={player.name}
            >
              {player.name}
            </li>
          ))}
        </ul>

        <form
          className="bg-neutral-50 flex h-14 overflow-hidden rounded-full"
          onSubmit={e => {
            e.preventDefault()
            sendTopic()
          }}
        >
          <TextInput
            className="rounded-r-none text-center w-full"
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
    </>
  )
}
