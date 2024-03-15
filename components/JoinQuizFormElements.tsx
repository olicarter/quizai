'use client'

import { useState } from 'react'
import { MagicWand } from '@phosphor-icons/react'
import { SubmitButton } from './SubmitButton'
import { TextInput } from './TextInput'
import { cn } from '@/utils/cn'

export function JoinQuizFormElements() {
  const [code, setCode] = useState('')

  return (
    <div className="bg-white border-4 border-pink flex rounded-full">
      <button
        className="absolute bg-pink border-4 border-white flex h-16 hover:bg-[hsl(340deg,90%,50%)] items-center justify-center rounded-full text-white w-16"
        onClick={() => {
          setCode(Math.random().toString(36).slice(2, 6).toUpperCase())
        }}
        type="button"
      >
        <MagicWand size={24} weight="bold" />
      </button>
      <TextInput
        autoComplete="off"
        className={cn(
          'bg-transparent ring-0 grow min-w-48 pl-16 rounded-r-none selection:bg-pink selection:text-amber-50 w-0',
          code.length > 0 && 'text-3xl tracking-widest uppercase',
        )}
        maxLength={4}
        minLength={4}
        name="code"
        onChange={e => setCode(e.target.value)}
        placeholder="Code"
        required
        value={code}
      />
      <SubmitButton
        className="border-4 border-white"
        disabled={code.length < 4}
      >
        Join quiz
      </SubmitButton>
    </div>
  )
}
