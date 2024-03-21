'use client'

import { PropsWithChildren, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { DifficultySection } from './DifficultySection'
import { TopicsSection } from './TopicsSection'
import { Button } from '@/components/Button'
import { Loading } from '@/components/Loading'
import { motion, Variants } from 'framer-motion'
import { NumberInput } from '@/components/NumberInput'
import { createQuiz } from '@/actions'

export function FormSections() {
  const [state, formAction] = useFormState(createQuiz, { errors: {} })
  const { pending } = useFormStatus()
  const [questionsCount, setQuestionsCount] = useState(5)

  if (pending) {
    return (
      <div className="flex flex-col grow items-center justify-center w-full">
        <div className="flex flex-col">
          <div className="h-64 relative w-64">
            <Loading />
          </div>
          <h1 className="absolute animate-pulse cursor-default flex font-extrabold inset-0 items-center justify-center text-sm text-rose-400">
            Generating
          </h1>
        </div>
      </div>
    )
  }

  const variants: Record<string, Variants> = {
    list: {
      animate: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    button: {
      animate: {
        opacity: 1,
        y: 0,
      },
      initial: {
        opacity: 0,
        y: 8,
      },
    },
  }

  return (
    <form action={formAction} className="flex flex-col grow justify-end">
      <motion.div
        animate="animate"
        className="flex flex-col gap-8 grow items-stretch justify-end p-4"
        initial="initial"
        variants={variants.list}
      >
        <Section>
          <section className="flex flex-col gap-4">
            <h3 className="text-center font-extrabold leading-none text-2xl">
              Questions
            </h3>
            <NumberInput
              max={50}
              min={5}
              name="questionsCount"
              onChange={e => setQuestionsCount(Number(e.target.value))}
              step={5}
              value={questionsCount}
            />
          </section>
        </Section>
        <Section>
          <DifficultySection />
        </Section>
        <Section>
          <TopicsSection maxTopics={questionsCount} />
        </Section>
        {state?.errors.topics && (
          <p className="text-center text-rose-500">{state.errors.topics}</p>
        )}
        <Button variants={variants.button}>Create quiz</Button>
      </motion.div>
    </form>
  )
}

function Section({ children }: PropsWithChildren) {
  const variants: Variants = {
    animate: {
      opacity: 1,
      y: 0,
    },
    initial: {
      opacity: 0,
      y: 8,
    },
  }

  return (
    <motion.section className="flex flex-col gap-4" variants={variants}>
      {children}
    </motion.section>
  )
}
