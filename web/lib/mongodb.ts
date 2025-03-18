'use server'

import { MongoClient } from "mongodb";
import verifyPassword from "@/lib/password";
import type { Entry } from "@/lib/StateManager";

// This would be replaced with the connection string from configuration
const getConnectionString = () => {
    return process.env.MONGODB_URI || "";
};

// Create a MongoDB client
const getClient = async () => {
    const uri = getConnectionString();
    if (!uri) {
        throw new Error("MongoDB connection string not found");
    }
    return new MongoClient(uri);
};

export async function insert(title: string, content: string, password: string): Promise<boolean> {
    try {
        if (!await verifyPassword(password)) return false;

        const client = await getClient();

        try {
            await client.connect();
            const database = client.db("diary");
            const entries = database.collection("entries");

            const entry: Entry = {
                date: new Date().toLocaleString(),
                content: content,
                title: title,
            };

            await entries.insertOne(entry);
            return true;
        } finally {
            await client.close();
        }
    } catch (error) {
        console.error("MongoDB Insert Error:", error);
        return false;
    }
}

export async function get(password: string): Promise<Entry[] | null> {
    try {
        if (!await verifyPassword(password)) return null;

        const client = await getClient();

        try {
            await client.connect();
            const database = client.db("diary");
            const entries = database.collection("entries");

            const results = await entries.find({}).toArray();
            return results as Entry[];
        } finally {
            await client.close();
        }
    } catch (error) {
        console.error("MongoDB Get Error:", error);
        return null;
    }
} 