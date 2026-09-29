/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // ponytail: Tailwind hanya tahu lebar. Ponsel landscape (mis. 667x375)
      // lolos semua breakpoint sm/md/lg tapi tingginya cuma 375 - padding
      // vertikal harus ikut mengecil, kalau tidak CTA-nya jatuh di bawah lipatan.
      // min-width 640 Supaya ponsel portrait (375x667) tetap longgar, bukan ikut rapat.
      screens: { short: { raw: '(min-width: 640px) and (max-height: 700px)' } },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: 'hsl(var(--secondary))',
        accent: 'hsl(var(--accent))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
      },
      fontFamily: {
        display: ['Instrument Serif', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}