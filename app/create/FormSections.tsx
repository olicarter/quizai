'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { DifficultySection } from './DifficultySection'
import { QuestionsSection } from './QuestionsSection'
import { TopicsSection } from './TopicsSection'
import { Button } from '@/components/Button'
import { Loading } from '@/components/Loading'

export function FormSections() {
  const { pending } = useFormStatus()
  const [questionsCount, setQuestionsCount] = useState(5)

  if (pending) {
    return (
      <div className="flex flex-col grow items-center justify-center w-full">
        <div className="flex flex-col">
          <div className="h-64 relative w-64">
            <Loading />
          </div>
          <h1 className="absolute animate-pulse cursor-default flex font-extrabold inset-0 items-center justify-center selection:bg-transparent text-sm text-rose-400">
            Generating
          </h1>
        </div>
      </div>
    )
  }

  return (
    <>
      <QuestionsSection
        questionsCount={questionsCount}
        setQuestionsCount={setQuestionsCount}
      />
      <DifficultySection />
      <TopicsSection maxTopics={questionsCount} />
      <Button>Create quiz</Button>
    </>
  )
}
