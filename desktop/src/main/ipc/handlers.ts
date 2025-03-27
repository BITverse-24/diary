import { ipcMain } from 'electron';
import { IPC_CHANNELS, IpcHandleChannel } from './channels';
import { logger } from '../lib/logger';
import verifyPassword from "../lib/password";
import { encryptData } from '../lib/encryption';
import { insert, deleteEntry } from '../lib/dynamodb';

// Type for handler function
type IpcHandler = (event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<any>;

// Map of channel names to their handler functions
const handlers: Record<IpcHandleChannel, IpcHandler> = {
    // Auth handlers
    [IPC_CHANNELS.AUTH.LOGIN]: async (event: Electron.IpcMainInvokeEvent, password: string) => {
        try {
            logger.info('Login attempt', { password: password });
            return verifyPassword(password);
        } catch (error) {
            logger.error('Login failed', { error });
            throw error;
        }
    },

    [IPC_CHANNELS.DIARY.CREATE_ENTRY]: async (event: Electron.IpcMainInvokeEvent, data: { title: string, body: string, password: string }) => {
        const { body, password, title } = data;
        try {
            const encrypted = await encryptData(body, password);
            return await insert(title, encrypted, password);
        } catch (error) {
            logger.error('Entry Creation failed', { error });
            throw error;
        }
    },

    [IPC_CHANNELS.DIARY.GET_ENTRIES]: async (event: Electron.IpcMainInvokeEvent) => {
        try {
            const entries = await DiaryService.getEntries(filters);
            // Decrypt content for each entry
            const decryptedEntries = entries.map(entry => ({
                ...entry,
                content: decrypt(entry.content)
            }));
            return { success: true, entries: decryptedEntries };
        } catch (error) {
            logger.error('Failed to get diary entries', { error });
            throw error;
        }
    },

    [IPC_CHANNELS.DIARY.GET_ENTRY]: async (event:Electron.IpcMainInvokeEvent, entryId:string) => {
        try {
            logger.info('
        } catch (error) {
            logger.error('Failed to get diary entry', { error, entryId });
            throw error;
        }
    },

    [IPC_CHANNELS.DIARY.DELETE_ENTRY]: async (event:Electron.IpcMainInvokeEvent, title: string,password:string) => {
        try {
            logger.info('Delete entry attempt', {title});
            return deleteEntry(title,password);
        }catch (error) {
            logger.error('Failed to delete entry attempt', { error });
            throw error;
        }
    }
};

export function setupIpcHandlers() {
    // Register all handlers
    Object.entries(handlers).forEach(([channel, handler]) => {
        ipcMain.handle(channel, handler);
    });
}
