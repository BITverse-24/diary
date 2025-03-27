import { ipcMain } from 'electron';
import verifyPassword from "../lib/password";

export default function registerVerifyPassword(): void {
	ipcMain.handle('verifyPassword', async (_event, password: string) => {
		return await verifyPassword(password);
	});
}
