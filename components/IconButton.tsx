import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/utils/cn'
import { type Icon as PhosphorIcon } from '@phosphor-icons/react'

interface IconButtonProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  icon: PhosphorIcon
  loading?: boolean
}

export function IconButton({
  className,
  disabled = false,
  icon: Icon,
  loading = false,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        `bg-rose-500 flex font-semibold h-16 items-center justify-center rounded-full shrink-0 text-white text-xl
        disabled:cursor-not-allowed disabled:text-rose-300 enabled:hover:bg-rose-600`,
        loading && 'animate-pulse cursor-wait opacity-50',
        className,
      )}
      disabled={disabled ?? loading}
      {...props}
    >
      <Icon size={28} weight="bold" />
    </button>
  )
}
