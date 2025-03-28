"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Entry } from "@/lib/StateManager";
import { useStateManager } from "@/lib/StateContext";
import { decryptData } from "@/lib/encryption";
import { deleteEntry } from "@/lib/dynamodb";

export default function EntryPage({ params }: { params: { id: string } }) {
	const [currentEntry, setCurrentEntry] = useState<Entry | null>(null);
	const [content, setContent] = useState("");
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const router = useRouter();
	const { state } = useStateManager();

	const loadEntryData = () => {
		const parsedId = parseInt(params.id);
		const entry = state.entries[parsedId];
		if (!entry) return;

		setCurrentEntry(entry);
		decryptData(entry.content, state.password).then((decryptedContent: string) => {
			setContent(decryptedContent);
		});
	};

	useEffect(() => {
		loadEntryData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Delete handler
	const handleDelete = async () => {
		if (!currentEntry) return;

		try {
			const success = await deleteEntry(currentEntry, state.password);
			if (success) {
				// Navigate away after deletion. You can also dispatch a global state update if needed.
				router.push("/");
			} else {
				console.error("Failed to delete entry");
			}
		} catch (error) {
			console.error("Error deleting entry:", error);
		} finally {
			setShowDeleteConfirm(false);
		}
	};

	if (!currentEntry) return <div>Loading...</div>;

	return (
		<div className="w-full relative">
			{/* Back Button */}
			<button
				onClick={() => router.back()}
				className="mb-4 flex items-center text-brown-700 dark:text-blue-300 hover:text-brown-900 dark:hover:text-blue-100 transition-colors"
			>
				<ArrowLeft size={20} className="mr-2" />
				<span className="font-special-elite">Back to Entries</span>
			</button>

			{/* Delete Button in Top-Right Corner */}
			<button
				onClick={() => setShowDeleteConfirm(true)}
				className="absolute top-0 right-0 mt-4 mr-4 text-red-500 hover:text-red-700 transition-colors"
			>
				<Trash2 size={20} />
			</button>

			<article className="bg-parchment-light dark:bg-navy-900 p-8 rounded-lg shadow-md border border-brown-300 dark:border-blue-800">
				<h1 className="text-4xl mb-4 text-brown-800 dark:text-blue-100">
					{currentEntry.title}
				</h1>
				<p className="text-base font-special-elite text-brown-600 dark:text-blue-300 mb-6">
					{currentEntry.date}
				</p>
				<hr className="my-6" />
				<div className="prose dark:prose-invert prose-brown dark:prose-blue max-w-none">
					<ReactMarkdown>{content}</ReactMarkdown>
				</div>
			</article>

			{/* Delete Confirmation Modal */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-[#2A2A2A] p-6 rounded-lg max-w-md w-full mx-4">
						<h2 className="text-xl text-[#FFD700] mb-4">Delete Entry</h2>
						<p className="text-[#FFD700] opacity-70 mb-6">
							Are you sure you want to delete this entry? This action cannot be undone.
						</p>
						<div className="flex justify-end gap-4">
							<button
								onClick={() => setShowDeleteConfirm(false)}
								className="px-4 py-2 text-[#FFD700] hover:opacity-80 transition-opacity"
							>
								Cancel
							</button>
							<button
								onClick={handleDelete}
								className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
