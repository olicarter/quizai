import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  loading?: boolean
}

export function Button({
  className,
  disabled = false,
  loading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        `bg-[hsl(340deg,100%,60%)] font-semibold h-16 px-7 rounded-full shrink-0 text-white text-xl
        disabled:cursor-not-allowed disabled:text-rose-300 enabled:hover:bg-[hsl(340deg,90%,50%)]`,
        loading && 'animate-pulse cursor-wait opacity-50',
        className,
      )}
      disabled={disabled ?? loading}
      {...props}
    />
  )
}
