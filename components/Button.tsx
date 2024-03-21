'use client'

import { cn } from '@/utils/cn'
import { motion, HTMLMotionProps } from 'framer-motion'
import { useAudio } from './AudioProvider'

interface ButtonProps extends HTMLMotionProps<'button'> {
  loading?: boolean
}

export function Button({
  className,
  disabled = false,
  loading = false,
  onClick,
  ...props
}: ButtonProps) {
  const { playFile } = useAudio()

  return (
    <motion.button
      className={cn(
        `bg-rose-500 font-semibold h-16 px-8 rounded-full shrink-0 text-white text-xl
        disabled:cursor-not-allowed disabled:text-rose-300 enabled:hover:bg-rose-600`,
        loading && 'animate-pulse cursor-wait opacity-50',
        className,
      )}
      disabled={disabled ?? loading}
      onClick={e => {
        playFile('/Button 5.m4a')
        onClick?.(e)
      }}
      {...props}
    />
  )
}
