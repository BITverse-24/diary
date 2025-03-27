import {ipcMain} from 'electron';
import {encryptData} from '@/lib/encryption'
import {insert} from "@/lib/dynamodb"


export default function registerInsertEntry(): void {
	ipcMain.handle('insertEntry', async (_event, data: { title:string, body: string, password: string }) => {
		const { title, body, password } = data;
		const encrypted = await encryptData(body, password);
		return await insert(title, encrypted, password);
	});
}
