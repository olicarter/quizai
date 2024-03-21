import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/utils/cn'
import dynamic from 'next/dynamic'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'µQuiz',
  description: 'The smallest AI powered quiz app',
}

const AudioProvider = dynamic(() => import('@/components/AudioProvider'), {
  ssr: false,
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, 'bg-amber-50 h-svh text-black w-svh')}
      >
        <AudioProvider>
          <div className="flex flex-col h-full max-w-sm mx-auto">
            {children}
          </div>
        </AudioProvider>
      </body>
    </html>
  )
}
