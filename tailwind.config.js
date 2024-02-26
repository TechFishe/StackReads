/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      height: {
        'fullscreen': 'calc(100vh - 88px)'
      },
      fontFamily: {
        kodeMono: ['"Kode Mono"', 'monospace' ],
        handlee: ['"Handlee"', 'cursive']
      },
      dropShadow: {
        'navBtn': '0 3px 2px rgba(170, 229, 223, 0.225)'
      },
      colors: {
        'snow': '#FFFBFA',
        'tiff': {
          '50': '#f2fbfa',
          '100': '#d5f2ef',
          '200': '#aae5df',
          '300': '#8bd7d2', // Base
          '400': '#4cb5b2',
          '500': '#329a99',
          '600': '#267a7b',
          '700': '#226263',
          '800': '#1f4f50',
          '900': '#1e4243',
          '950': '#0c2627',
        },
        'coral': {
          '50': '#fdf3f3',
          '100': '#fce4e4',
          '200': '#facfce',
          '300': '#f6acab',
          '400': '#ee7674', // Base
          '500': '#e35250',
          '600': '#d03532',
          '700': '#ae2927',
          '800': '#902624',
          '900': '#782524',
          '950': '#410f0e',
        },
        'mint': {
          '50': '#effaf4',
          '100': '#d9f2e4',
          '200': '#b7e3cd',
          '300': '#87ceae',
          '400': '#63b995', // Base
          '500': '#339670',
          '600': '#237859',
          '700': '#1c6049',
          '800': '#184d3b',
          '900': '#153f32',
          '950': '#0b231d',
        },
      }
    },
  },
  plugins: [],
}

