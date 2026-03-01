/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'inherit',
            lineHeight: '1.75',
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '2em',
              marginBottom: '2em',
              overflowX: 'auto',
              display: 'block',
            },
            'thead th': {
              backgroundColor: theme('colors.blue.50'),
              color: theme('colors.blue.900'),
              fontWeight: '600',
              border: `1px solid ${theme('colors.blue.200')}`,
              padding: '0.75rem',
            },
            'tbody td': {
              border: `1px solid ${theme('colors.blue.200')}`,
              padding: '0.75rem',
            },
            'ul': {
              listStyleType: 'disc',
              paddingLeft: '1.5em',
            },
            'ul li::marker': {
              color: theme('colors.blue.600'),
            },
            'ol': {
              listStyleType: 'decimal',
              paddingLeft: '1.5em',
            },
            'ol li::marker': {
              color: theme('colors.blue.600'),
              fontWeight: '600',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};