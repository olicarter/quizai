'use client'

import { useFormStatus } from 'react-dom'
import { type HTMLMotionProps } from 'framer-motion'
import { Button } from '@/components/Button'

export function SubmitButton(props: HTMLMotionProps<'button'>) {
  const { pending } = useFormStatus()

  return <Button loading={pending} {...props} />
}
