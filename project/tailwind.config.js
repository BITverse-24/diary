/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inconsolata', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#FFD700',
            a: {
              color: '#FFD700',
              '&:hover': {
                color: '#FFE55C',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
