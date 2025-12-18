import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e2',
          100: '#fde6c5',
          200: '#fbcd8b',
          300: '#f9b451',
          400: '#f79b17',
          500: '#f58220',
          600: '#c46819',
          700: '#934e13',
          800: '#62340c',
          900: '#311a06',
          950: '#190d03',
        },
      },
    },
  },
  plugins: [],
};
export default config;
