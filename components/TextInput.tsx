import { cn } from '@/utils/cn'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'

export const TextInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<'input'>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        'bg-white focus:ring-[hsl(340deg,90%,50%)] font-semibold h-16 outline-none placeholder:text-rose-300 ring-4 ring-inset ring-[hsl(340deg,100%,60%)] rounded-full text-center text-[hsl(340deg,100%,60%)] text-xl',
        className,
      )}
      ref={ref}
      type="text"
      {...props}
    />
  )
})

TextInput.displayName = 'TextInput'
