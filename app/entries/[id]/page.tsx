"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { ArrowLeft } from "lucide-react"
import { Entry } from "@/lib/StateManager"
import { useStateManager } from "@/lib/StateContext";

export default function EntryPage({ params }: { params: { id: string } }) {
	const [entry, setEntry] = useState<Entry>({} as Entry)
	const router = useRouter();
	const { state } = useStateManager();

	useEffect(() => {
		setEntry(state.entries[parseInt(params.id)])
	}, []);

	if (!entry) return <div>Loading...</div>

	return (
		<div className="w-full">
			<button
				onClick={() => router.back()}
				className="mb-4 flex items-center text-brown-700 dark:text-blue-300 hover:text-brown-900 dark:hover:text-blue-100 transition-colors"
			>
				<ArrowLeft size={20} className="mr-2" />

				<span className="font-special-elite">Back to Entries</span>

			</button>
			<article className="bg-parchment-light dark:bg-navy-900 p-8 rounded-lg shadow-md border border-brown-300 dark:border-blue-800">
				<h1 className="text-4xl mb-4 text-brown-800 dark:text-blue-100">{entry.name}</h1>
				<p className="text-base font-special-elite text-brown-600 dark:text-blue-300 mb-6">{entry.date}</p>
				<hr className="my-6" />
				<div className="prose dark:prose-invert prose-brown dark:prose-blue max-w-none">
					<ReactMarkdown>{entry.content}</ReactMarkdown>
				</div>
			</article>
		</div>
	)
}

