import {ipcMain} from 'electron';
import {get} from "@/lib/dynamodb"
import StateManager from '@/lib/StateManager'
import { decryptData } from "@/lib/encryption";

export default function registerRetrieveEntries(): void {
	ipcMain.handle('retrieveEntry', async (_event, id: number) => {
		let entry = StateManager.getEntries()[id];

		entry.content = await decryptData(entry.content, StateManager.getPassword());
		return entry;
	});
}
