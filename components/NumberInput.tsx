import { Minus, Plus } from '@phosphor-icons/react/dist/ssr'
import { IconButton } from './IconButton'
import { ComponentPropsWithoutRef, useRef } from 'react'
import { useAudio } from '@/components/AudioProvider'

interface NumberInputProps extends ComponentPropsWithoutRef<'input'> {
  max?: number
  min?: number
  step?: number
  value: number
}

export function NumberInput({ step = 1, ...props }: NumberInputProps) {
  const { playFile } = useAudio()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="bg-white border-4 border-rose-500 flex h-16 overflow-hidden relative rounded-full">
      <IconButton
        className="absolute border-4 border-white h-14 w-14"
        icon={Minus}
        onClick={() => {
          playFile('/Tab 3.m4a')
          inputRef.current?.stepDown()
        }}
        type="button"
      />
      <input
        className="border-none cursor-default font-bold grow h-full outline-0 rounded-full text-3xl text-center text-black"
        readOnly
        ref={inputRef}
        step={step}
        type="number"
        {...props}
      />
      <IconButton
        className="absolute border-4 border-white h-14 right-0 w-14"
        icon={Plus}
        onClick={() => {
          playFile('/Tab 2.m4a')
          inputRef.current?.stepUp()
        }}
        type="button"
      />
    </div>
  )
}
