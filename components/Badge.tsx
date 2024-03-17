import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/utils/cn'
import { type Color } from '@/types'
import { Check } from '@phosphor-icons/react'

interface BadgeProps extends ComponentPropsWithoutRef<'button'> {
  color: Color
  showCheck?: boolean
}

export function Badge({
  children,
  className,
  showCheck = false,
  ...props
}: BadgeProps) {
  return (
    <button
      className={cn(
        'font-semibold h-8 px-3.5 relative rounded-full',
        props.onClick && 'cursor-pointer',
        {
          'bg-rose-300': props.color === 'rose',
          'bg-amber-300': props.color === 'amber',
          'bg-green-300': props.color === 'green',
          'bg-cyan-300': props.color === 'cyan',
          'bg-indigo-300': props.color === 'indigo',
          'bg-fuchsia-300': props.color === 'fuchsia',
        },
        className,
      )}
      disabled={props.onClick === undefined}
      type="button"
      {...props}
    >
      {children}
      {showCheck && (
        <div className="-right-1 -top-1 absolute bg-green-400 flex h-4 items-center justify-center rounded-full w-4">
          <Check size={12} weight="bold" />
        </div>
      )}
    </button>
  )
}
