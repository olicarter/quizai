import { type PropsWithChildren } from 'react'

export default function QuizLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-4 h-full justify-center p-4 w-full">
      {children}
    </div>
  )
}
