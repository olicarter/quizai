'use client'

import { useState } from 'react'
import { MagicWand } from '@phosphor-icons/react'
import { SubmitButton } from './SubmitButton'
import { TextInput } from './TextInput'

export function JoinQuizFormElements() {
  const [code, setCode] = useState('')

  return (
    <>
      <button
        className="absolute bg-[hsl(340deg,100%,60%)] border-4 border-white flex h-14 hover:bg-[hsl(340deg,90%,50%)] items-center justify-center m-1 rounded-full text-white w-14"
        onClick={() => {
          setCode(Math.random().toString(36).slice(2, 6).toUpperCase())
        }}
        type="button"
      >
        <MagicWand size={24} weight="bold" />
      </button>
      <TextInput
        autoComplete="off"
        className="bg-transparent focus:ring-[hsl(340deg,100%,60%)] grow min-w-48 pl-12 rounded-r-none selection:bg-[hsl(340deg,100%,60%)] selection:text-amber-50 uppercase w-0"
        maxLength={4}
        minLength={4}
        name="code"
        onChange={e => setCode(e.target.value)}
        placeholder="Code"
        required
        value={code}
      />
      <SubmitButton className="rounded-l-none" disabled={code.length < 4}>
        Join quiz
      </SubmitButton>
    </>
  )
}
