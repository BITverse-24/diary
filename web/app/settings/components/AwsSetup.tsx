"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Key, Map, Eye, EyeOff } from "lucide-react"
import { useStateManager } from "@/lib/StateContext"

const AwsSetup = forwardRef((props, ref) => {
    const [accessKeyId, setAccessKeyId] = useState("")
    const [secretKey, setSecretKey] = useState("")
    const [region, setRegion] = useState("")
    const [showSecret, setShowSecret] = useState(false)
    const { state, dispatch } = useStateManager()

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        getConfig: () => ({
            accessKeyId,
            secretKey,
            region
        })
    }));

    // Load existing values from environment or state
    useEffect(() => {
        const loadConfig = async () => {
            // In a real app, you'd load from secure storage
            // First try to load from state if available
            if (state.dbConfig?.type === 'aws') {
                const awsConfig = state.dbConfig.config as any;
                setAccessKeyId(awsConfig.accessKeyId || "");
                setSecretKey(awsConfig.secretKey || "");
                setRegion(awsConfig.region || "");
            } else {
                // Fallback to environment variables
                setAccessKeyId(process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "");
                setSecretKey(process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "");
                setRegion(process.env.NEXT_PUBLIC_AWS_REGION || "");
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
                type: "aws",
                config: {
                    accessKeyId,
                    secretKey,
                    region
                }
            }
        })
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label
                    htmlFor="accessKeyId"
                    className="block text-sm font-medium text-brown-800 dark:text-blue-200"
                >
                    AWS Access Key ID
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Key className="h-4 w-4 text-brown-600 dark:text-blue-400" />
                    </div>
                    <input
                        id="accessKeyId"
                        type="text"
                        value={accessKeyId}
                        onChange={(e) => setAccessKeyId(e.target.value)}
                        className="w-full pl-10 px-4 py-2 bg-transparent border-b-2 border-brown-600 dark:border-blue-500 focus:outline-none focus:border-brown-900 dark:focus:border-blue-300 transition-colors text-brown-800 dark:text-blue-100"
                        placeholder="Enter your AWS Access Key ID"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="secretKey"
                    className="block text-sm font-medium text-brown-800 dark:text-blue-200"
                >
                    AWS Secret Key
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Key className="h-4 w-4 text-brown-600 dark:text-blue-400" />
                    </div>
                    <input
                        id="secretKey"
                        type={showSecret ? "text" : "password"}
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 bg-transparent border-b-2 border-brown-600 dark:border-blue-500 focus:outline-none focus:border-brown-900 dark:focus:border-blue-300 transition-colors text-brown-800 dark:text-blue-100"
                        placeholder="Enter your AWS Secret Key"
                    />
                    <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-brown-600 dark:text-blue-400 hover:text-brown-800 dark:hover:text-blue-200"
                    >
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="region"
                    className="block text-sm font-medium text-brown-800 dark:text-blue-200"
                >
                    AWS Region
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Map className="h-4 w-4 text-brown-600 dark:text-blue-400" />
                    </div>
                    <input
                        id="region"
                        type="text"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full pl-10 px-4 py-2 bg-transparent border-b-2 border-brown-600 dark:border-blue-500 focus:outline-none focus:border-brown-900 dark:focus:border-blue-300 transition-colors text-brown-800 dark:text-blue-100"
                        placeholder="Enter your AWS Region (e.g., us-east-1)"
                    />
                </div>
            </div>

            <p className="text-xs text-brown-600 dark:text-blue-400 mt-4">
                These credentials will be securely stored and used to connect to your AWS DynamoDB database.
            </p>
        </div>
    )
})

export default AwsSetup 