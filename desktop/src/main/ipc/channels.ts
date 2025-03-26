export const IPC_CHANNELS = {
    // Authentication channels
    AUTH: {
        LOGIN: 'auth:login',
        LOGOUT: 'auth:logout',
        REGISTER: 'auth:register'
    },

    // User management channels
    USER: {
        CHANGE_PASSWORD: 'user:change-password',
        MIGRATE: 'user:migrate',
    },

    // Diary entries channels
    DIARY: {
        CREATE_ENTRY: 'diary:create-entry',
        GET_ENTRIES: 'diary:get-entries',
        GET_ENTRY: 'diary:get-entry',
        DELETE_ENTRY: 'diary:delete-entry'
    },

    // System channels
    SYSTEM: {
        GET_APP_VERSION: 'system:get-app-version',
        CHECK_UPDATE: 'system:check-update',
        DOWNLOAD_UPDATE: 'system:download-update'
    }
} as const;

// Type for all possible IPC channel names
export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS][keyof typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS]];

// Type for IPC event names (channels that use ipcMain.on)
export type IpcEventChannel = Extract<IpcChannel,
    | typeof IPC_CHANNELS.SYSTEM.CHECK_UPDATE
    | typeof IPC_CHANNELS.SYSTEM.DOWNLOAD_UPDATE
>;

// Type for IPC handle names (channels that use ipcMain.handle)
export type IpcHandleChannel = Exclude<IpcChannel, IpcEventChannel>;
