'use server'

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand  } from "@aws-sdk/lib-dynamodb";
import verifyPassword from "./password";
import type { Entry } from "./StateManager"

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "diary";

export async function insert(
	title: string,
	content: string,
	password: string,
	createdAt: Date,
    characters: number
	): Promise<boolean> {
	try {
		if (!await verifyPassword(password)) return false;
		console.log('Password Verified')
		const entry: Entry = {
			content: content,
			title: title,
			createdAt: createdAt,
			characters: characters
		};

		await docClient.send(new PutCommand({
			TableName: TABLE_NAME,
			Item: entry,
		}));

		return true;
	} catch (error) {
		console.error("DynamoDB Insert Error:", error);
		return false;
	}
}


export async function get(password: string): Promise<Entry[] | null> {
	try {
		if (!await verifyPassword(password)) return null;
		const response = await docClient.send(new ScanCommand({
			TableName: "diary"
		}));

		return response.Items as Entry[] || [];
	} catch (error) {
		console.error("DynamoDB Get Error:", error);
		return null;
	}
}
