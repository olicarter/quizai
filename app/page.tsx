import { Loading } from '@/components/Loading'
import { redirect } from 'next/navigation'
import { JoinQuizCodeInput } from '@/components/JoinQuizCodeInput'
import Link from 'next/link'
import { Button } from '@/components/Button'

export default function Home() {
  const joinQuiz = async (formData: FormData) => {
    'use server'
    const code = formData.get('code')
    if (typeof code === 'string') {
      redirect(`/${code.toUpperCase()}`)
    }
  }

  return (
    <div className="flex flex-col gap-8 grow items-stretch justify-around p-8 w-full">
      <div className="flex grow items-center justify-center">
        <div className="h-64 relative w-64">
          <Loading />
          <h1 className="absolute cursor-default flex font-extrabold inset-0 items-center justify-center text-5xl text-rose-500">
            µQuiz
          </h1>
        </div>
      </div>
      <form action={joinQuiz}>
        <JoinQuizCodeInput />
      </form>
      <Link className="rounded-full text-rose-500 underline" href="/create">
        <Button className="w-full" type="button">
          Generate quiz
        </Button>
      </Link>
    </div>
  )
}
