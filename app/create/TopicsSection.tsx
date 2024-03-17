'use client'

import { Button } from '@/components/Button'
import { type ComponentPropsWithoutRef, useState, useEffect } from 'react'
import { MagicWand, Trash } from '@phosphor-icons/react'
import { TextInput } from '@/components/TextInput'
import { IconButton } from '@/components/IconButton'
import { cn } from '@/utils/cn'

export function TopicsSection(props: { maxTopics: number }) {
  const [topic, setTopic] = useState('')
  const [topics, setTopics] = useState<string[]>([])

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-center font-extrabold leading-none text-2xl">
        Topics
      </h3>
      {topics.length > 0 && (
        <ul className="flex flex-wrap gap-2 justify-center">
          {topics.map(topic => (
            <Badge
              className="bg-rose-300"
              onClick={() => {
                setTopics(prev => prev.filter(t => t !== topic))
              }}
              key={topic}
              topic={topic}
            />
          ))}
        </ul>
      )}
      <div className="bg-white border-4 border-rose-500 flex h-16 rounded-full w-full">
        {/* <IconButton
          className="absolute border-4 border-white flex h-14 items-center justify-center rounded-full text-white w-14"
          disabled={topics.length >= props.maxTopics}
          icon={MagicWand}
          onClick={() => {
            // setCode(Math.random().toString(36).slice(2, 6).toUpperCase())
          }}
        /> */}
        <TextInput
          autoComplete="off"
          className="bg-transparent border-none h-full pl-4 pr-0 focus:ring-0 ring-0 grow rounded-r-none selection:bg-rose-400 selection:text-white w-0"
          disabled={topics.length >= props.maxTopics}
          maxLength={30}
          minLength={2}
          name="topic"
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              setTopics(prev => [...prev, topic])
              setTopic('')
            }
          }}
          placeholder="Topic"
          value={topic}
        />
        <Button
          className="border-4 border-white h-14"
          disabled={topics.length >= props.maxTopics || topic.length < 2}
          onClick={() => {
            setTopics(prev => [...prev, topic])
            setTopic('')
          }}
          type="button"
        >
          Add topic
        </Button>
      </div>
    </section>
  )
}

interface BadgeProps extends ComponentPropsWithoutRef<'button'> {
  topic: string
}

function Badge({ className, ...props }: BadgeProps) {
  return (
    <div>
      <input type="hidden" name="topics" value={props.topic} />
      <button
        className={cn(
          'group flex font-semibold h-12 items-center justify-center px-6 hover:pr-5 rounded-full text-lg transition-[padding] duration-150 delay-150 hover:delay-0 truncate',
          className,
        )}
        onClick={props.onClick}
      >
        {props.topic}
        <div className="group-hover:w-[20px] flex group-hover:ml-3 delay-150 group-hover:delay-0 items-center justify-center overflow-hidden w-0 duration-150 transition-all">
          <Trash
            className="group-hover:opacity-100 relative top-1 group-hover:top-0 opacity-0 group-hover:delay-150 delay-0 transition-[opacity,top] duration-150"
            size={20}
            weight="bold"
          />
        </div>
      </button>
    </div>
  )
}
