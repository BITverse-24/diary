"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Database, Save } from "lucide-react"
import { useStateManager } from "@/lib/StateContext"
import AwsSetup from "./components/AwsSetup"
import MongoSetup from "./components/MongoSetup"
import { updateDatabaseConfig } from "@/lib/database"

export default function Settings() {
    const [activeTab, setActiveTab] = useState<"aws" | "mongo">("aws")
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)
    const router = useRouter()
    const { state, dispatch } = useStateManager()

    // References to child component methods
    const awsRef = useRef<{ getConfig: () => any }>(null)
    const mongoRef = useRef<{ getConfig: () => any }>(null)

    const handleSave = async () => {
        try {
            setSaving(true)
            setMessage(null)

            let config

            if (activeTab === "aws" && awsRef.current) {
                config = {
                    type: "aws",
                    config: awsRef.current.getConfig()
                }
            } else if (activeTab === "mongo" && mongoRef.current) {
                config = {
                    type: "mongo",
                    config: mongoRef.current.getConfig()
                }
            } else {
                throw new Error("Could not get configuration")
            }

            // Save to state
            dispatch({ type: "DB_CONFIG", payload: config })

            // Save to server/environment
            const result = await updateDatabaseConfig(config)

            if (result) {
                setMessage({ type: "success", text: "Database configuration saved successfully" })
                // Wait a moment before redirecting
                setTimeout(() => router.push("/"), 1500)
            } else {
                setMessage({ type: "error", text: "Failed to save database configuration" })
            }
        } catch (error) {
            console.error("Error saving settings:", error)
            setMessage({ type: "error", text: "An error occurred while saving settings" })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="w-full max-w-md">
            <h1 className="text-4xl font-eb-garamond mb-8 text-center text-brown-900 dark:text-blue-100">
                Database Settings
            </h1>
            <div className="bg-parchment-dark dark:bg-navy-900 p-8 rounded-lg shadow-lg border-2 border-brown-600 dark:border-blue-700">
                {/* Tab selection */}
                <div className="flex mb-6 border-b border-brown-600 dark:border-blue-700">
                    <button
                        className={`flex-1 py-2 px-4 font-eb-garamond text-lg ${activeTab === "aws"
                            ? "border-b-2 border-brown-800 dark:border-blue-500 text-brown-900 dark:text-blue-100"
                            : "text-brown-600 dark:text-blue-400 hover:text-brown-800 dark:hover:text-blue-200"
                            }`}
                        onClick={() => setActiveTab("aws")}
                    >
                        AWS DynamoDB
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 font-eb-garamond text-lg ${activeTab === "mongo"
                            ? "border-b-2 border-brown-800 dark:border-blue-500 text-brown-900 dark:text-blue-100"
                            : "text-brown-600 dark:text-blue-400 hover:text-brown-800 dark:hover:text-blue-200"
                            }`}
                        onClick={() => setActiveTab("mongo")}
                    >
                        MongoDB / SQL
                    </button>
                </div>

                {/* Tab content */}
                <div className="mt-4">
                    {activeTab === "aws" ? (
                        <AwsSetup ref={awsRef} />
                    ) : (
                        <MongoSetup ref={mongoRef} />
                    )}
                </div>

                {/* Message display */}
                {message && (
                    <div className={`mt-4 p-2 rounded ${message.type === "success" ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100" : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100"}`}>
                        {message.text}
                    </div>
                )}

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={() => router.push("/")}
                        className="px-4 py-2 font-eb-garamond border border-brown-600 dark:border-blue-700 text-brown-800 dark:text-blue-200 rounded-md hover:bg-brown-100 dark:hover:bg-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-600 dark:focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-4 py-2 font-eb-garamond bg-brown-700 dark:bg-blue-800 text-parchment dark:text-blue-100 rounded-md hover:bg-brown-800 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-600 dark:focus:ring-blue-500 focus:ring-opacity-50 flex items-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <Save className="mr-2" size={18} />
                        {saving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </div>
        </div>
    )
} 