"use client"

import Link from "next/link"
import { PlusCircle } from "lucide-react"
import {useEffect, useState} from "react";
import { useStateManager } from "@/lib/StateContext";
import { get } from "@/lib/dynamodb"

export default function Entries() {
	const [entries, setEntries] = useState<{ title: string, content: string, date: string }[]>([]);
	const { state, dispatch } = useStateManager();
	const { password } = state;
	if (!password) return <div>Loading...</div>

	useEffect(() => {
		async function sync() {
			const res = await get(password);
			setEntries(res ?? []);
			dispatch(
				{
					type: "ENTRY",
					payload: res,
				}
			,)
		}

		sync();
	}, [])


	return (
		<div className="w-full max-w-4xl">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-eb-garamond text-brown-900 dark:text-blue-100">My Entries</h1>
				<Link
					href="/new"
					className="flex items-center text-brown-700 dark:text-blue-300 hover:text-brown-900 dark:hover:text-blue-100 transition-colors"
				>
					<PlusCircle size={24} className="mr-2" />
					<span className="font-special-elite">New Entry</span>
				</Link>
			</div>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{entries.map((entry, index) => (
					<div
						key={index}
						className="bg-parchment-light dark:bg-navy-900 p-6 rounded-lg shadow-md border border-brown-300 dark:border-blue-800 hover:shadow-lg transition-shadow"
					>
						<h2 className="text-xl font-eb-garamond mb-2 text-brown-800 dark:text-blue-100">{entry.title}</h2>
						<p className="text-sm font-special-elite text-brown-600 dark:text-blue-300 mb-4">{entry.date}</p>
						<Link
							href={`/entries/${index}`}
							className="text-brown-600 dark:text-blue-300 hover:text-brown-800 dark:hover:text-blue-100 font-special-elite"
						>
							View Entry
						</Link>
					</div>
				))}
			</div>
		</div>
	)
}

