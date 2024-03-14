const numDots = 6

export function Loading() {
  return (
    <div className="h-32 relative rotate-45 w-32">
      {new Array(numDots).fill(null).map((_, i) => (
        <div
          key={i}
          className="absolute animate-spin inset-4 mix-blend-lighten"
          style={{
            animationDirection: i % 2 ? 'reverse' : 'normal',
            animationDuration: `${2 + i * 1.01}s`,
          }}
        >
          <div
            className="bg-amber-500 h-4 rounded-full w-4"
            style={{
              filter: `hue-rotate(${i * (360 / numDots)}deg) saturate(2)`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
