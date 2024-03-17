import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/utils/cn'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'µQuiz',
  description: 'The smallest AI powered quiz app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className="*:w-full bg-amber-50 flex flex-col items-center text-black"
      lang="en"
    >
      <body
        className={cn(
          inter.className,
          'flex flex-col max-w-sm min-h-svh w-svh',
        )}
      >
        {children}
      </body>
    </html>
  )
}
