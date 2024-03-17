'use client'

import { type Dispatch, type SetStateAction } from 'react'
import { Minus, Plus } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'

export function QuestionsSection(props: {
  questionsCount: number
  setQuestionsCount: Dispatch<SetStateAction<number>>
}) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-center font-extrabold leading-none text-2xl">
        Questions
      </h3>
      <div className="bg-white border-4 border-rose-500 flex h-16 overflow-hidden relative rounded-full">
        <IconButton
          className="absolute border-4 border-white h-14 w-14"
          icon={Minus}
          onClick={() => {
            props.setQuestionsCount(prev => (prev >= 10 ? prev - 5 : prev))
          }}
          type="button"
        />
        <input
          className="border-none cursor-default font-bold grow h-full outline-0 rounded-full selection:bg-rose-400 selection:text-white text-3xl text-center text-black"
          min={5}
          max={50}
          name="questionsCount"
          readOnly
          step={5}
          type="number"
          value={props.questionsCount}
        />
        <IconButton
          className="absolute border-4 border-white h-14 right-0 w-14"
          icon={Plus}
          onClick={() => {
            props.setQuestionsCount(prev => (prev <= 45 ? prev + 5 : prev))
          }}
          type="button"
        />
      </div>
    </section>
  )
}
