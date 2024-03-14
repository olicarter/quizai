import { cn } from '@/utils/cn'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'

export const TextInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<'input'>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        'bg-rose-50 focus:outline-none focus:ring-4 focus:ring-inset focus:ring-rose-500 font-semibold h-14 rounded-full text-center text-xl',
        className,
      )}
      ref={ref}
      type="text"
      {...props}
    />
  )
})

TextInput.displayName = 'TextInput'
