import "./globals.css"
import { Inter, Special_Elite, EB_Garamond } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const specialElite = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-special-elite" })
const ebGaramond = EB_Garamond({ subsets: ["latin"], variable: "--font-eb-garamond" })

export const metadata = {
  title: "Personal Diary",
  description: "A nostalgic personal diary web application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${specialElite.variable} ${ebGaramond.variable} font-sans bg-parchment dark:bg-navy-950`}
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

