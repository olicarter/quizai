import { Loading } from '@/components/Loading'
import { redirect } from 'next/navigation'
import { JoinQuizFormElements } from '@/components/JoinQuizFormElements'

export default function Home() {
  const joinQuiz = async (formData: FormData) => {
    'use server'
    const code = formData.get('code')
    if (typeof code === 'string') {
      redirect(`/${code.toUpperCase()}`)
    }
  }

  return (
    <div className="flex flex-col grow items-center justify-around w-full">
      <div className="h-64 relative w-64">
        <Loading />
        <h1 className="absolute cursor-default flex font-extrabold inset-0 items-center justify-center selection:bg-transparent text-5xl text-pink">
          µQuiz
        </h1>
      </div>
      <form action={joinQuiz}>
        <JoinQuizFormElements />
      </form>
    </div>
  )
}
