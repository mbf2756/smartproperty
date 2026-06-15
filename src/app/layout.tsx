import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'SmartProperty — Australian Property Investment Modelling',
    template: '%s | SmartProperty',
  },
  description: "Australia's independent property investment modelling platform. Acquisition analyser, portfolio dashboard, CGT planner, negative gearing calculator. General information only — not financial advice.",
  keywords: ['property investment calculator', 'negative gearing', 'CGT calculator', 'Australian property', 'investment property cash flow'],
  openGraph: {
    siteName: 'SmartProperty',
    type: 'website',
    locale: 'en_AU',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
