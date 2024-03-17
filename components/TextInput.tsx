import { cn } from '@/utils/cn'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'

export const TextInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<'input'>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        `bg-white font-semibold h-16 outline-none ring-4 ring-inset ring-rose-400 rounded-full text-center text-black text-xl
        disabled:cursor-not-allowed focus:ring-[hsl(340deg,90%,50%)] placeholder:text-neutral-300 selection:bg-rose-400 selection:text-white`,
        className,
      )}
      ref={ref}
      type="text"
      {...props}
    />
  )
})

TextInput.displayName = 'TextInput'
