import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import '../styles/globals.css';
import '@aws-amplify/ui-react/styles.css';



export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark"> {/* Remove "dark" if you use a theme toggle */}
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} bg-[var(--background-gradient)] text-[var(--foreground)]`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
