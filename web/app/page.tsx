"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import type { FormEvent } from "react"
import verifyPassword from "@/lib/password";
import { useStateManager } from "@/lib/StateContext";

export default function Home() {
	const [password, setPassword] = useState("")
	const router = useRouter()
	const { dispatch } = useStateManager()

	const handleUnlock = (e: FormEvent) => {
		e.preventDefault()
		const verifyPwd = async () => {
			if (await verifyPassword(password)) {
				dispatch({ type: "PASSWORD", payload: password });
				router.push("/entries");
			}
		}
		verifyPwd()
	}

	return (
		<div className="w-full max-w-md text-center">
			<h1 className="text-4xl font-eb-garamond mb-8 text-brown-900 dark:text-blue-100">Personal Diary</h1>
			<div className="bg-parchment-dark dark:bg-navy-900 p-8 rounded-lg shadow-lg border-2 border-brown-600 dark:border-blue-700">
				<form onSubmit={handleUnlock} className="space-y-6">
					<div className="relative">
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 text-lg font-special-elite bg-transparent border-b-2 border-brown-600 dark:border-blue-500 focus:outline-none focus:border-brown-900 dark:focus:border-blue-300 transition-colors text-brown-800 dark:text-blue-100"
							placeholder="Enter your secret key"
						/>
						<Lock
							className="absolute right-2 top-1/2 transform -translate-y-1/2 text-brown-600 dark:text-blue-400"
							size={20}
						/>
					</div>
					<button
						type="submit"
						className="w-full px-4 py-2 text-lg font-eb-garamond bg-brown-700 dark:bg-blue-800 text-parchment dark:text-blue-100 rounded-md hover:bg-brown-800 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-600 dark:focus:ring-blue-500 focus:ring-opacity-50"
					>
						Unlock
					</button>
				</form>
			</div>
		</div>
	)
}

