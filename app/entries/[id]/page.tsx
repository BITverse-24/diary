"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { ArrowLeft } from "lucide-react"

// Mock data - replace with actual data fetching in a real application
const getEntry = (id: string) => ({
	id,
	title: "A day to remember",
	date: "2023-05-15",
	content: `# A day to remember

Today was filled with unexpected joys and moments of pure bliss. As I sit here, pen in hand, I can't help but smile at the memories.

## Morning Surprise

- Woke up to the smell of freshly baked croissants
- Found a handwritten note from a dear friend

## Afternoon Adventure

1. Stumbled upon a hidden garden
2. Met a kind stranger who shared their story
3. Discovered a quaint bookshop with rare editions

*The day was a reminder that beauty can be found in the most unexpected places.*

> "The best things in life are the people we love, the places we've been, and the memories we've made along the way."

As I close my eyes, I can still feel the warmth of the sun and hear the laughter that echoed through the streets. **Today was truly a day to remember.**`,
})

export default function EntryPage({ params }: { params: { id: string } }) {
	const [entry, setEntry] = useState<any>(null)
	const router = useRouter()

	useEffect(() => {
		// In a real application, you would fetch the entry data here
		setEntry(getEntry(params.id))
	}, [params.id])

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
				<h1 className="text-4xl mb-4 text-brown-800 dark:text-blue-100">{entry.title}</h1>
				<p className="text-base font-special-elite text-brown-600 dark:text-blue-300 mb-6">{entry.date}</p>
				<hr className="my-6" />
				<div className="prose dark:prose-invert prose-brown dark:prose-blue max-w-none">
					<ReactMarkdown>{entry.content}</ReactMarkdown>
				</div>
			</article>
		</div>
	)
}

