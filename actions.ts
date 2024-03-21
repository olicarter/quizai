'use server'

import { redirect } from 'next/navigation'
import { PartySocket } from 'partysocket'
import { z } from 'zod'
import { Difficulty } from '@/types'

export const createQuiz = async (prevState: any, formData: FormData) => {
  const schema = z.object({
    difficulty: z.nativeEnum(Difficulty),
    questionsCount: z.number().multipleOf(5).min(5).max(50),
    topics: z
      .array(z.string(), {
        errorMap: (issue, ctx) => {
          switch (issue.code) {
            case z.ZodIssueCode.too_small: {
              return { message: 'You must add at least one topic' }
            }
            default: {
              return { message: ctx.defaultError }
            }
          }
        },
      })
      .min(1),
  })

  const difficulty = formData.get('difficulty')
  const questionsCount = Number(formData.get('questionsCount'))
  const topics = formData.getAll('topics')

  const validatedFields = schema.safeParse({
    difficulty,
    questionsCount,
    topics,
  })

  console.log(validatedFields)

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const code = Math.random().toString(36).slice(2, 6).toUpperCase()
  const { status } = await PartySocket.fetch(
    {
      host: process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
      room: code,
      path: 'create',
    },
    {
      body: JSON.stringify({ difficulty, questionsCount, topics }),
      method: 'POST',
    },
  )
  if (status === 200) redirect(code)
}
