/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        RedHat: ["'Red Hat Mono Variable'", 'monospace'],
        Playpen: ["'Playpen Sans Variable'", 'cursive'],
      },
      colors: {
        Woodsmoke: {
          50: '#f4f5f7',
          100: '#e4e5e9',
          200: '#cbcdd6',
          300: '#a7aab9',
          400: '#7b7f95',
          500: '#60637a',
          600: '#525468',
          700: '#474957',
          800: '#3f3f4b',
          900: '#383941',
          950: '#09090b', // Base
        },
        SpringWood: {
          50: '#f9f7f1', // Base
          100: '#f2eee2',
          200: '#e5dcc3',
          300: '#d4c49d',
          400: '#c2a775',
          500: '#b5915a',
          600: '#a77e4f',
          700: '#8b6643',
          800: '#71533b',
          900: '#5c4532',
          950: '#312319',
        },
        MonteCarlo: {
          50: '#f2fbfa',
          100: '#d5f2ef',
          200: '#aae5df',
          300: '#8bd7d2', // Base
          400: '#4cb5b2',
          500: '#329a99',
          600: '#267a7b',
          700: '#226263',
          800: '#1f4f50',
          900: '#1e4243',
          950: '#0c2627',
        },
      },
    },
  },
  plugins: [],
};
