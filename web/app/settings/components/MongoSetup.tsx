"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Link2, Eye, EyeOff } from "lucide-react"
import { useStateManager } from "@/lib/StateContext"

const MongoSetup = forwardRef((props, ref) => {
    const [connectionString, setConnectionString] = useState("")
    const [showConnectionString, setShowConnectionString] = useState(false)
    const { state, dispatch } = useStateManager()

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        getConfig: () => ({
            connectionString
        })
    }));

    // Load existing values from environment or state
    useEffect(() => {
        const loadConfig = async () => {
            // First try to load from state if available
            if (state.dbConfig?.type === 'mongo') {
                const mongoConfig = state.dbConfig.config as any;
                setConnectionString(mongoConfig.connectionString || "");
            } else {
                // Fallback to environment variables
                setConnectionString(process.env.NEXT_PUBLIC_MONGODB_URI || "")
            }
        }

        loadConfig()
    }, [state.dbConfig])

    const handleSave = () => {
        // In a real app, you'd securely store these values
        // and update your application configuration
        dispatch({
            type: "DB_CONFIG",
            payload: {
                type: "mongo",
                config: {
                    connectionString
                }
            }
        })
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label
                    htmlFor="connectionString"
                    className="block text-sm font-medium text-brown-800 dark:text-blue-200"
                >
                    Connection String
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Link2 className="h-4 w-4 text-brown-600 dark:text-blue-400" />
                    </div>
                    <input
                        id="connectionString"
                        type={showConnectionString ? "text" : "password"}
                        value={connectionString}
                        onChange={(e) => setConnectionString(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 bg-transparent border-b-2 border-brown-600 dark:border-blue-500 focus:outline-none focus:border-brown-900 dark:focus:border-blue-300 transition-colors text-brown-800 dark:text-blue-100"
                        placeholder="mongodb://username:password@host:port/database"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConnectionString(!showConnectionString)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-brown-600 dark:text-blue-400 hover:text-brown-800 dark:hover:text-blue-200"
                    >
                        {showConnectionString ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <p className="text-xs text-brown-600 dark:text-blue-400 mt-4">
                For MongoDB: <span className="font-mono">mongodb://username:password@host:port/database</span><br />
                For MySQL: <span className="font-mono">mysql://username:password@host:port/database</span><br />
                For PostgreSQL: <span className="font-mono">postgresql://username:password@host:port/database</span>
            </p>
        </div>
    )
})

export default MongoSetup 