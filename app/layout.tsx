import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import type React from "react"
import localFont from 'next/font/local';

export const metadata = {
  title: "Personal Diary",
  description: "A nostalgic personal diary web application",
}

const jetbrainsMono = localFont({
  src: './fonts/mono.woff2',
  weight: '100 900',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jetbrainsMono.className} bg-parchment dark:bg-navy-950`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <header className="p-4 flex justify-end">
              <ModeToggle />
            </header>
            <main className="flex-grow flex flex-col items-center justify-center p-4">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

