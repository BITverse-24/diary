import {ipcMain} from 'electron';
import {get} from "@/lib/dynamodb"
import StateManager from '@/lib/StateManager'

export default function registerRetrieveEntries(): void {
	ipcMain.handle('retrieveEntries', async (_event) => {
		const res = await get(StateManager.getPassword()) || [];
		StateManager.setEntries(res);
		return res;
	});
}
