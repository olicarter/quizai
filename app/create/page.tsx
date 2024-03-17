import { FormSections } from './FormSections'
import { PartySocket } from 'partysocket'
import { redirect } from 'next/navigation'

export default function CreateQuizPage() {
  const createQuiz = async (formData: FormData) => {
    'use server'
    const difficulty = formData.get('difficulty')
    const questionsCount = Number(formData.get('questionsCount'))
    const topics = formData.getAll('topics')
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

  return (
    <form
      action={createQuiz}
      className="flex flex-col gap-8 grow items-stretch justify-end p-4"
    >
      <FormSections />
    </form>
  )
}
