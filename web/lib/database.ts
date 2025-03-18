'use server'

import * as dynamoDb from './dynamodb';
import * as mongoDb from './mongodb';
import type { Entry, DatabaseConfig } from '@/lib/StateManager';

// Get the current database configuration from environment variables
const getDatabaseType = (): 'aws' | 'mongo' => {
    // This could be stored in a more persistent way
    // In a real app, check the configuration from somewhere secure
    if (process.env.MONGODB_URI) {
        return 'mongo';
    }
    return 'aws'; // Default to AWS DynamoDB
};

// Insert a diary entry using the configured database
export async function insert(title: string, content: string, password: string): Promise<boolean> {
    const dbType = getDatabaseType();

    if (dbType === 'mongo') {
        return mongoDb.insert(title, content, password);
    } else {
        return dynamoDb.insert(title, content, password);
    }
}

// Get diary entries using the configured database
export async function get(password: string): Promise<Entry[] | null> {
    const dbType = getDatabaseType();

    if (dbType === 'mongo') {
        return mongoDb.get(password);
    } else {
        return dynamoDb.get(password);
    }
}

// Update database configuration
export async function updateDatabaseConfig(config: DatabaseConfig): Promise<boolean> {
    try {
        // In a real application, you would securely store these credentials
        // and update environment variables or configuration files

        // This is a simplified example - in a real app, you would need to 
        // handle this more securely and possibly restart the server

        if (config.type === 'aws') {
            const awsConfig = config.config as any;
            process.env.AWS_ACCESS_KEY_ID = awsConfig.accessKeyId;
            process.env.AWS_SECRET_ACCESS_KEY = awsConfig.secretKey;
            process.env.AWS_REGION = awsConfig.region;

            // Clear MongoDB URI if switching to AWS
            process.env.MONGODB_URI = '';
        } else if (config.type === 'mongo') {
            const mongoConfig = config.config as any;
            process.env.MONGODB_URI = mongoConfig.connectionString;

            // Clear AWS credentials if switching to MongoDB
            process.env.AWS_ACCESS_KEY_ID = '';
            process.env.AWS_SECRET_ACCESS_KEY = '';
            process.env.AWS_REGION = '';
        }

        return true;
    } catch (error) {
        console.error('Error updating database configuration:', error);
        return false;
    }
} 