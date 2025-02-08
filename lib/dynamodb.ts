import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME as string;

interface EntrySchema {
	date: string;
	name: string;
	content: string;
}


export async function insert(name: string, content: string): Promise<boolean> {
	try {
		const entry: EntrySchema = {
			date: new Date().toISOString(),
			content: content,
			name: name,
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


export async function get(): Promise<EntrySchema[] | null> {
	try {
		const response = await docClient.send(new QueryCommand({
			TableName: TABLE_NAME,
			IndexName: "name"
		}));

		return response.Items as EntrySchema[] || [];
	} catch (error) {
		console.error("DynamoDB Get Error:", error);
		return null;
	}
}
