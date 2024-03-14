import { SubmitButton } from '@/components/SubmitButton'
import { TextInput } from '@/components/TextInput'
import { redirect } from 'next/navigation'
import { PartySocket } from 'partysocket'

export default function Home() {
  const createQuiz = async () => {
    'use server'
    const code = Math.random().toString(36).slice(2, 6).toUpperCase()
    await PartySocket.fetch(
      {
        host: process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
        room: code,
      },
      { method: 'POST' },
    )
    redirect(`/${code}`)
  }

  const joinQuiz = async (formData: FormData) => {
    'use server'
    const code = formData.get('code')
    if (typeof code === 'string') {
      redirect(`/${code.toUpperCase()}`)
    }
  }

  return (
    <div className="flex flex-col gap-4 items-stretch max-w-96 text-center w-full">
      <h1 className="font-bold text-5xl">QuizAI</h1>
      <form action={joinQuiz} className="bg-rose-50 flex rounded-full">
        <TextInput
          autoComplete="off"
          className="grow rounded-r-none uppercase"
          maxLength={4}
          minLength={4}
          name="code"
          pattern="[A-Z0-9]{4}"
          placeholder="Code"
          required
        />
        <SubmitButton className="rounded-l-none">Join quiz</SubmitButton>
      </form>
      <form action={createQuiz} className="flex flex-col">
        <SubmitButton>Create quiz</SubmitButton>
      </form>
    </div>
  )
}
