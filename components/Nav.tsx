'use client'

import * as PhosphorIcons from '@phosphor-icons/react/dist/ssr'
import { type Icon as PhosphorIcon } from '@phosphor-icons/react'
import { ComponentPropsWithoutRef } from 'react'
import links from '@/utils/randomLinks.json'

export function Nav() {
  return (
    <div
      className="@container/root bg-white/40 overflow-auto min-w-[64px] resize rounded-[32px]"
      style={{ scrollbarWidth: 'none' }}
    >
      <div className="flex flex-col gap-2 p-2 transition-all">
        {links.map((link, index) => (
          <NavLink
            href=""
            icon={
              PhosphorIcons[
                link.icon as keyof typeof PhosphorIcons
              ] as PhosphorIcon
            }
            key={link.text}
            selected={index === 0}
          >
            {link.text}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

function NavLink({
  selected = false,
  ...props
}: ComponentPropsWithoutRef<'a'> & { icon: PhosphorIcon; selected?: boolean }) {
  return (
    <a
      className="@container/link hover:bg-white/25 data-[selected=true]:bg-white/50 flex gap-3 h-12 items-center justify-center rounded-full w-full @5xs/root:px-4"
      data-selected={selected}
      href="/"
    >
      <props.icon className="shrink-0" size={24} weight="bold" />
      <span className="font-semibold grow hidden @5xs/link:block truncate">
        {props.children}
      </span>
    </a>
  )
}
