/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Surface Hierarchy ──
        background:               'rgb(var(--bg) / <alpha-value>)',
        surface:                  'rgb(var(--surface) / <alpha-value>)',
        surfaceDim:               'rgb(var(--surface-dim) / <alpha-value>)',
        surfaceBright:            'rgb(var(--surface-bright) / <alpha-value>)',
        surfaceContainerLowest:   'rgb(var(--surface-container-lowest) / <alpha-value>)',
        surfaceContainerLow:      'rgb(var(--surface-container-low) / <alpha-value>)',
        surfaceContainer:         'rgb(var(--surface-container) / <alpha-value>)',
        surfaceContainerHigh:     'rgb(var(--surface-container-high) / <alpha-value>)',
        surfaceContainerHighest:  'rgb(var(--surface-container-highest) / <alpha-value>)',
        surfaceVariant:           'rgb(var(--surface-variant) / <alpha-value>)',
        surfaceTint:              'rgb(var(--surface-tint) / <alpha-value>)',

        // ── On-Surface Text ──
        onSurface:                'rgb(var(--on-surface) / <alpha-value>)',
        onSurfaceVariant:         'rgb(var(--on-surface-variant) / <alpha-value>)',
        inverseSurface:           'rgb(var(--inverse-surface) / <alpha-value>)',
        inverseOnSurface:         'rgb(var(--inverse-on-surface) / <alpha-value>)',

        // ── Primary ──
        primary:                  'rgb(var(--primary) / <alpha-value>)',
        onPrimary:                'rgb(var(--on-primary) / <alpha-value>)',
        primaryContainer:         'rgb(var(--primary-container) / <alpha-value>)',
        onPrimaryContainer:       'rgb(var(--on-primary-container) / <alpha-value>)',
        inversePrimary:           'rgb(var(--inverse-primary) / <alpha-value>)',

        // ── Secondary ──
        secondary:                'rgb(var(--secondary) / <alpha-value>)',
        onSecondary:              'rgb(var(--on-secondary) / <alpha-value>)',
        secondaryContainer:       'rgb(var(--secondary-container) / <alpha-value>)',
        onSecondaryContainer:     'rgb(var(--on-secondary-container) / <alpha-value>)',

        // ── Tertiary ──
        tertiary:                 'rgb(var(--tertiary) / <alpha-value>)',
        onTertiary:               'rgb(var(--on-tertiary) / <alpha-value>)',
        tertiaryContainer:        'rgb(var(--tertiary-container) / <alpha-value>)',
        onTertiaryContainer:      'rgb(var(--on-tertiary-container) / <alpha-value>)',

        // ── Error ──
        error:                    'rgb(var(--error) / <alpha-value>)',
        onError:                  'rgb(var(--on-error) / <alpha-value>)',
        errorContainer:           'rgb(var(--error-container) / <alpha-value>)',
        onErrorContainer:         'rgb(var(--on-error-container) / <alpha-value>)',

        // ── Outline ──
        outline:                  'rgb(var(--outline) / <alpha-value>)',
        outlineVariant:           'rgb(var(--outline-variant) / <alpha-value>)',
      },
      fontFamily: {
        lexend: ['Lexend', 'sans-serif'],
      },
      fontSize: {
        'display-lg':  ['48px', { lineHeight: '56px',  fontWeight: '600', letterSpacing: '-0.02em' }],
        'headline-lg': ['32px', { lineHeight: '40px',  fontWeight: '500' }],
        'headline-md': ['24px', { lineHeight: '32px',  fontWeight: '500' }],
        'body-lg':     ['18px', { lineHeight: '28px',  fontWeight: '400' }],
        'body-md':     ['16px', { lineHeight: '24px',  fontWeight: '400' }],
        'label-md':    ['14px', { lineHeight: '20px',  fontWeight: '500', letterSpacing: '0.01em' }],
        'label-sm':    ['12px', { lineHeight: '16px',  fontWeight: '600', letterSpacing: '0.05em' }],
      },
      borderRadius: {
        'sm':  '0.25rem',
        'DEFAULT': '0.5rem',
        'md':  '0.75rem',
        'lg':  '1rem',
        'xl':  '1.5rem',
        'full': '9999px',
      },
      spacing: {
        'unit': '8px',
        'gutter': '24px',
        'section-gap': '48px',
      },
      boxShadow: {
        'ambient':   '0px 8px 32px rgba(0, 0, 0, 0.08)',
        'ambient-lg': '0px 12px 48px rgba(0, 0, 0, 0.12)',
        'glow-primary': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-primary-lg': '0 0 40px rgba(16, 185, 129, 0.4)',
      },
      backdropBlur: {
        'glass': '24px',
        'glass-heavy': '40px',
      },
      transitionDuration: {
        '350': '350ms',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in':  'fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
    },
  },
  plugins: [],
}