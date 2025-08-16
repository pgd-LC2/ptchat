import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 1.4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
} satisfies Config;
