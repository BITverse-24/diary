import {ipcMain} from 'electron';
import {encryptData} from '@/lib/encryption'
import {insert} from "@/lib/dynamodb"
import StateManager from '@/lib/StateManager'

export default function registerInsertEntry(): void {
	ipcMain.handle('insertEntry', async (_event, data: { title:string, body: string, password: string }) => {
		const { title, body, password } = data;
		const encrypted = await encryptData(body, password);
		StateManager.addEntry({
			title: title,
			content: body,
			date: new Date().toLocaleString()
		});
		return await insert(title, encrypted, password);
	});
}
