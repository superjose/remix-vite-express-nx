import typography from '@tailwindcss/typography';
import daisyui from 'daisyui';
import fluidTailwind from 'fluid-tailwind';
import tailwindcssAnimated from 'tailwindcss-animated';
import daisyuiThemes from 'daisyui/src/theming/themes';

/**
 * Use imports not require. 
 * NX will complain.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: {
    files: [
      './app/**/*.{ts,tsx,jsx,js}',
      '../../libs/ui/src/**/*.{ts,tsx,jsx,js}',
    ],
  },
  theme: {
    extend: {
      colors: {
        primary: '#a473ab',
        'primary-content': '#ffffff',
        deploud: {
          light: '#d1bec9',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [
    typography,
    daisyui,
    fluidTailwind,
    tailwindcssAnimated,
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...daisyuiThemes['light'],
          primary: '#a473ab',
          'primary-content': '#ffffff',
        },
        dark: {
          ...daisyuiThemes['dark'],
          primary: '#a473ab',
        },
      },
    ],
  },
};
