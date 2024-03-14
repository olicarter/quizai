'use client'

import { Button } from '@/components/Button'
import { type ComponentPropsWithoutRef } from 'react'
import { useFormStatus } from 'react-dom'

export function SubmitButton(props: ComponentPropsWithoutRef<'button'>) {
  const { pending } = useFormStatus()

  return <Button loading={pending} {...props} />
}
