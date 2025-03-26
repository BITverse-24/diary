import { ipcMain } from 'electron';
import { IPC_CHANNELS, IpcHandleChannel } from './channels';
import { logger } from '../lib/logger';
import verifyPassword from "../lib/password";
import { encrypt, decrypt } from '../utils/encryption';

// Type for handler function
type IpcHandler = (event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<any>;

// Map of channel names to their handler functions
const handlers: Record<IpcHandleChannel, IpcHandler> = {
    // Auth handlers
    [IPC_CHANNELS.AUTH.LOGIN]: async (event: any, password: string) => {
        try {
            logger.info('Login attempt', { password: password });
            return verifyPassword(password);
        } catch (error) {
            logger.error('Login failed', { error });
            throw error;
        }
    },

    [IPC_CHANNELS.AUTH.REGISTER]: async (event, userData) => {
        try {
            logger.info('Registration attempt', { username: userData.username });
            const result = await AuthService.register(userData);
            return { success: true, ...result };
        } catch (error) {
            logger.error('Registration failed', { error });
            throw error;
        }
    },

    [IPC_CHANNELS.AUTH.VERIFY_TOKEN]: async (event, token) => {
        try {
            const isValid = await AuthService.verifyToken(token);
            return { success: true, isValid };
        } catch (error) {
            logger.error('Token verification failed', { error });
            throw error;
        }
    },

    // User handlers
    [IPC_CHANNELS.USER.GET_PROFILE]: async (event) => {
        try {
            const profile = await UserService.getProfile();
            return { success: true, profile };
        } catch (error) {
            logger.error('Failed to get profile', { error });
            throw error;
        }
    },

    [IPC_CHANNELS.USER.UPDATE_PROFILE]: async (event, profileData) => {
        try {
            const updatedProfile = await UserService.updateProfile(profileData);
            return { success: true, profile: updatedProfile };
        } catch (error) {
            logger.error('Failed to update profile', { error });
            throw error;
        }
    },

    [IPC_CHANNELS.USER.CHANGE_PASSWORD]: async (event, passwordData) => {
        try {
            await UserService.changePassword(passwordData);
            return { success: true };
        } catch (error) {
            logger.error('Failed to change password', { error });
            throw error;
        }
    },

    // Diary handlers
    [IPC_CHANNELS.DIARY.CREATE_ENTRY]: async (event, entry) => {
        try {
            // Encrypt sensitive data before storing
            const encryptedContent = encrypt(entry.content);
            const result = await DiaryService.createEntry({
                ...entry,
                content: encryptedContent
            });
            return { success: true, entryId: result.id };
        } catch (error) {
            logger.error('Failed to create diary entry', { error });
            throw error;
        }
    },

    [IPC_CHANNELS.DIARY.GET_ENTRIES]: async (event, filters) => {
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

    [IPC_CHANNELS.DIARY.GET_ENTRY]: async (event, entryId) => {
        try {
            const entry = await DiaryService.getEntry(entryId);
            if (!entry) {
                return { success: false, error: 'Entry not found' };
            }
            // Decrypt content
            const decryptedEntry = {
                ...entry,
                content: decrypt(entry.content)
            };
            return { success: true, entry: decryptedEntry };
        } catch (error) {
            logger.error('Failed to get diary entry', { error, entryId });
            throw error;
        }
    },

    [IPC_CHANNELS.DIARY.UPDATE_ENTRY]: async (event, { id, ...entryData }) => {
        try {
            // Encrypt content before updating
            const encryptedContent = encrypt(entryData.content);
            const result = await DiaryService.updateEntry(id, {
                ...entryData,
                content: encryptedContent
            });
            return { success: true, entry: result };
        } catch (error) {
            logger.error('Failed to update diary entry', { error, entryId: id });
            throw error;
        }
    },

    [IPC_CHANNELS.DIARY.DELETE_ENTRY]: async (event, entryId) => {
        try {
            await DiaryService.deleteEntry(entryId);
            return { success: true };
        } catch (error) {
            logger.error('Failed to delete diary entry', { error, entryId });
            throw error;
        }
    },

    // System handlers
    [IPC_CHANNELS.SYSTEM.GET_APP_VERSION]: async () => {
        try {
            const version = await SystemService.getAppVersion();
            return { success: true, version };
        } catch (error) {
            logger.error('Failed to get app version', { error });
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
