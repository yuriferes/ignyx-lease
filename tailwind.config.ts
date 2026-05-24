import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        'brand-navy': 'var(--brand-navy)',
        'brand-navy-hover': 'var(--brand-navy-hover)',
        'brand-navy-subtle': 'var(--brand-navy-subtle)',
        'brand-green': 'var(--brand-accent-green)',
        'brand-teal': 'var(--brand-accent-teal)',
        'brand-blue': 'var(--brand-accent-blue)',
        'bg-base': 'var(--bg)',
        'bg-elevated': 'var(--bg-elevated)',
        surface: 'var(--surface)',
        'surface-hover': 'var(--surface-hover)',
        'border-default': 'var(--border)',
        'border-strong': 'var(--border-strong)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-disabled': 'var(--text-disabled)',
        'text-on-brand': 'var(--text-on-brand)',
        success: 'var(--success)',
        'success-bg': 'var(--success-bg)',
        warning: 'var(--warning)',
        'warning-bg': 'var(--warning-bg)',
        error: 'var(--error)',
        'error-bg': 'var(--error-bg)',
        info: 'var(--info)',
        'info-bg': 'var(--info-bg)',
        ignyx: {
          navy: 'rgb(var(--ignyx-navy) / <alpha-value>)',
          'navy-2': 'rgb(var(--ignyx-navy-2) / <alpha-value>)',
          'navy-3': 'rgb(var(--ignyx-navy-3) / <alpha-value>)',
          green: 'rgb(var(--ignyx-green) / <alpha-value>)',
          'green-soft': 'rgb(var(--ignyx-green-soft) / <alpha-value>)',
          'green-light': 'rgb(var(--ignyx-green-light) / <alpha-value>)',
          teal: 'rgb(var(--ignyx-teal) / <alpha-value>)',
          'teal-light': 'rgb(var(--ignyx-teal-light) / <alpha-value>)',
          blue: 'rgb(var(--ignyx-blue) / <alpha-value>)',
          'blue-soft': 'rgb(var(--ignyx-blue-soft) / <alpha-value>)',
          'blue-light': 'rgb(var(--ignyx-blue-light) / <alpha-value>)',
          ink: 'rgb(var(--ignyx-ink) / <alpha-value>)',
          'ink-2': 'rgb(var(--ignyx-ink-2) / <alpha-value>)',
          'ink-3': 'rgb(var(--ignyx-ink-3) / <alpha-value>)',
          'ink-4': 'rgb(var(--ignyx-ink-4) / <alpha-value>)',
          bg: 'rgb(var(--ignyx-bg) / <alpha-value>)',
          'bg-2': 'rgb(var(--ignyx-bg-2) / <alpha-value>)',
          surface: 'rgb(var(--ignyx-surface) / <alpha-value>)',
          line: 'rgb(var(--ignyx-line) / <alpha-value>)',
          'line-2': 'rgb(var(--ignyx-line-2) / <alpha-value>)',
          success: 'rgb(var(--ignyx-success) / <alpha-value>)',
          warning: 'rgb(var(--ignyx-warning) / <alpha-value>)',
          error: 'rgb(var(--ignyx-error) / <alpha-value>)',
          gold: 'rgb(var(--ignyx-gold) / <alpha-value>)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': '1rem',
        '3xl': '1.25rem',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        'ignyx-sm': 'var(--ignyx-shadow-sm)',
        'ignyx-md': 'var(--ignyx-shadow-md)',
        'ignyx-lg': 'var(--ignyx-shadow-lg)',
        'ignyx-xl': 'var(--ignyx-shadow-xl)',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        apple: 'var(--ease-apple)',
      },
      backgroundImage: {
        'brand-gradient': 'var(--brand-gradient)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.text-kpi-lg': {
          fontSize: '42px',
          fontWeight: '700',
          lineHeight: '1.05',
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
        },
        '.text-kpi-md': {
          fontSize: '32px',
          fontWeight: '700',
          lineHeight: '1.1',
          letterSpacing: '-0.01em',
          fontVariantNumeric: 'tabular-nums',
        },
        '.text-kpi-sm': {
          fontSize: '24px',
          fontWeight: '700',
          lineHeight: '1.15',
          letterSpacing: '-0.01em',
          fontVariantNumeric: 'tabular-nums',
        },
        '.tnum': {
          fontVariantNumeric: 'tabular-nums',
        },
      });
    }),
  ],
};

export default config;
