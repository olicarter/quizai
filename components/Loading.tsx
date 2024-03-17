import { colors } from '@/types'
import { cn } from '@/utils/cn'

export function Loading({ dots = colors }: { dots?: string[] }) {
  return (
    <div className="h-full relative z-10 w-full">
      {dots.map((color, i) => {
        return (
          <div
            key={i}
            className="absolute animate-spin inset-9 mix-blend-lighten"
            style={{
              animationDirection: i % 2 ? 'reverse' : 'normal',
              animationDuration: `${3 + i * 1.01}s`,
            }}
          >
            <div
              className={cn('h-5 rounded-full saturate-200 w-5', {
                'bg-rose-400': color === 'rose',
                'bg-amber-400': color === 'amber',
                'bg-green-400': color === 'green',
                'bg-cyan-400': color === 'cyan',
                'bg-indigo-400': color === 'indigo',
                'bg-fuchsia-400': color === 'fuchsia',
              })}
            />
          </div>
        )
      })}
    </div>
  )
}

// export function Loading() {
//   return (
//     <div className="h-full relative z-10 w-full">
//       {new Array(numDots).fill(null).map((_, i) => {
//         return (
//           <div
//             key={i}
//             className="absolute animate-spin inset-9 mix-blend-lighten"
//             style={{
//               animationDirection: i % 2 ? 'reverse' : 'normal',
//               animationDuration: `${3 + i * 1.01}s`,
//             }}
//           >
//             <div
//               className="h-5 rounded-full saturate-200 w-5"
//               style={{
//                 backgroundColor: `hsl(${
//                   40 + ((i * (360 / numDots)) % 360)
//                 },100%,60%)`,
//               }}
//             />
//           </div>
//         )
//       })}
//     </div>
//   )
// }
