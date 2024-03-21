'use client'

import { createContext, useContext, type PropsWithChildren } from 'react'

type PlayFile = (filepath: string) => Promise<void>

export const AudioContext = createContext<{
  context: AudioContext
  playFile: PlayFile
} | null>(null)

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) throw new Error('useAudio must be used within an AudioProvider')
  return context
}

export default function AudioProvider({ children }: PropsWithChildren) {
  const context = new window.AudioContext()

  const playFile: PlayFile = async filepath => {
    // see https://jakearchibald.com/2016/sounds-fun/
    // Fetch the file
    const response = await fetch(filepath)
    // Read it into memory as an arrayBuffer
    const arrayBuffer = await response.arrayBuffer()
    // Turn it from mp3/aac/whatever into raw audio data
    const audioBuffer = await context.decodeAudioData(arrayBuffer)
    // Now we're ready to play!
    const soundSource = context.createBufferSource()
    soundSource.buffer = audioBuffer
    soundSource.connect(context.destination)
    soundSource.start()
  }

  return (
    <AudioContext.Provider value={{ context, playFile }}>
      {children}
    </AudioContext.Provider>
  )
}
