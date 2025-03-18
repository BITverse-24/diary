import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { Settings } from "lucide-react"
import type { ReactNode } from "react"
import localFont from 'next/font/local';
import { StateProvider } from "@/lib/StateContext";

export const metadata = {
	title: "Post Quantum Diary",
	description: "A Post Quantum Diary meant for extra security",
}

const jetbrainsMono = localFont({
	src: './fonts/mono.woff2',
	weight: '100 900',
});

export default function RootLayout({
	children,
}: {
	children: ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${jetbrainsMono.className} bg-parchment dark:bg-navy-950`}
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<div className="min-h-screen flex flex-col">
						<header className="p-4 flex justify-end items-center">
							<Link
								href="/settings"
								className="mr-4 p-2 rounded-md hover:bg-parchment-dark dark:hover:bg-navy-900 text-brown-700 dark:text-blue-300 transition-colors"
							>
								<Settings size={20} />
							</Link>
							<ModeToggle />
						</header>
						<main className="flex-grow flex flex-col items-center justify-center p-4">
							<StateProvider>
								{children}
							</StateProvider>
						</main>
					</div>
				</ThemeProvider>
			</body>
		</html>
	)
}

