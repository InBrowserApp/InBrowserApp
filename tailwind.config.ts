import type { Config } from 'tailwindcss'

export default {
  content: [
    './apps/web/src/**/*.{astro,html,js,jsx,ts,tsx}',
    './tools/**/src/**/*.{astro,html,js,jsx,ts,tsx}',
    './packages/**/src/**/*.{astro,html,js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
