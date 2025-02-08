"use client"

import Link from "next/link"
import { PlusCircle } from "lucide-react"

const entries = [
  { id: 1, title: "A day to remember", date: "2023-05-15", excerpt: "Today was filled with unexpected joys..." },
  { id: 2, title: "Reflections on change", date: "2023-05-10", excerpt: "As the seasons shift, so do my thoughts..." },
  { id: 3, title: "Dreams and aspirations", date: "2023-05-05", excerpt: "In the quiet of the night, I pondered..." },
]

export default function Entries() {
  return (
    <div className="w-full max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-eb-garamond text-brown-900 dark:text-blue-100">My Entries</h1>
        <Link
          href="/new-entry"
          className="flex items-center text-brown-700 dark:text-blue-300 hover:text-brown-900 dark:hover:text-blue-100 transition-colors"
        >
          <PlusCircle size={24} className="mr-2" />
          <span className="font-special-elite">New Entry</span>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-parchment-light dark:bg-navy-900 p-6 rounded-lg shadow-md border border-brown-300 dark:border-blue-800 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-eb-garamond mb-2 text-brown-800 dark:text-blue-100">{entry.title}</h2>
            <p className="text-sm font-special-elite text-brown-600 dark:text-blue-300 mb-4">{entry.date}</p>
            <p className="text-brown-700 dark:text-blue-200 mb-4 line-clamp-3">{entry.excerpt}</p>
            <Link
              href={`/entries/${entry.id}`}
              className="text-brown-600 dark:text-blue-300 hover:text-brown-800 dark:hover:text-blue-100 font-special-elite underline"
            >
              Read more...
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

