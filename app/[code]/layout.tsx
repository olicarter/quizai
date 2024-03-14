import { type PropsWithChildren } from 'react'

export default function QuizLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-4 h-full items-center justify-center min-h-screen p-4 w-full">
      {children}
    </div>
  )
}
