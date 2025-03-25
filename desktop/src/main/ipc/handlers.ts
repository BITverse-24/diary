import { ipcMain } from 'electron';

export function setupIpcHandlers() {
    // Example IPC handler
    ipcMain.on('toMain', (event, data) => {
        // Handle the message from renderer
        console.log('Received in main:', data);

        // Send response back to renderer
        event.reply('fromMain', 'Message received in main process');
    });
} 