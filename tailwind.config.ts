import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // orange: 'hsl(40deg,100%,60%)',
        // green: 'hsl(100deg,100%,60%)',
        // cyan: 'hsl(160deg,100%,60%)',
        // blue: 'hsl(220deg,100%,60%)',
        // violet: 'hsl(280deg,100%,60%)',
        // pink: 'hsl(340deg,100%,60%)',
      },
      containers: {
        '8xs': '1rem',
        '7xs': '2rem',
        '6xs': '4rem',
        '5xs': '6rem',
        '4xs': '8rem',
        '3xs': '12rem',
        '2xs': '16rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/forms'),
  ],
}
export default config
