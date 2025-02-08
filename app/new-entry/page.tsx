"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bold, Italic, List, Heading } from "lucide-react"

export default function NewEntry() {
  const [content, setContent] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would save the entry here
    console.log("New entry:", content)
    router.push("/entries")
  }

  const insertMarkdown = (tag: string) => {
    const textarea = document.getElementById("editor") as HTMLTextAreaElement
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const before = text.substring(0, start)
    const selection = text.substring(start, end)
    const after = text.substring(end)
    const newText = `${before}${tag}${selection}${tag}${after}`
    setContent(newText)
    textarea.focus()
    textarea.setSelectionRange(start + tag.length, end + tag.length)
  }

  return (
    <div className="w-full max-w-4xl">
      <h1 className="text-3xl font-eb-garamond mb-8 text-brown-900 dark:text-blue-100">New Entry</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex space-x-2 mb-2">
          <button
            type="button"
            onClick={() => insertMarkdown("**")}
            className="p-2 bg-brown-200 dark:bg-blue-800 rounded hover:bg-brown-300 dark:hover:bg-blue-700 transition-colors"
          >
            <Bold size={20} className="text-brown-800 dark:text-blue-100" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("*")}
            className="p-2 bg-brown-200 dark:bg-blue-800 rounded hover:bg-brown-300 dark:hover:bg-blue-700 transition-colors"
          >
            <Italic size={20} className="text-brown-800 dark:text-blue-100" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("# ")}
            className="p-2 bg-brown-200 dark:bg-blue-800 rounded hover:bg-brown-300 dark:hover:bg-blue-700 transition-colors"
          >
            <Heading size={20} className="text-brown-800 dark:text-blue-100" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("- ")}
            className="p-2 bg-brown-200 dark:bg-blue-800 rounded hover:bg-brown-300 dark:hover:bg-blue-700 transition-colors"
          >
            <List size={20} className="text-brown-800 dark:text-blue-100" />
          </button>
        </div>
        <textarea
          id="editor"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-64 p-4 font-special-elite text-brown-800 dark:text-blue-100 bg-parchment-light dark:bg-navy-900 border-2 border-brown-300 dark:border-blue-700 rounded-md resize-none focus:outline-none focus:border-brown-600 dark:focus:border-blue-500 transition-colors"
          placeholder="Write your entry here..."
        ></textarea>
        <button
          type="submit"
          className="px-6 py-2 bg-brown-700 dark:bg-blue-800 text-parchment dark:text-blue-100 rounded-md hover:bg-brown-800 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-600 dark:focus:ring-blue-500 focus:ring-opacity-50"
        >
          Save Entry
        </button>
      </form>
    </div>
  )
}

