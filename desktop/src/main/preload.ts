import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'api', {
    send: (channel: string, data: any) => {
        // whitelist channels
        const validChannels = [
            'toMain',
            'state:update',
            'state:reset',
            'state:clear'
        ];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel: string, func: Function) => {
        const validChannels = [
            'fromMain',
            'state:sync'
        ];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender` 
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
    // State management methods
    state: {
        get: (key: string) => ipcRenderer.invoke('state:get', key),
        set: (key: string, value: any) => ipcRenderer.invoke('state:set', { key, value }),
        reset: (key: string) => ipcRenderer.invoke('state:reset', key),
        clear: () => ipcRenderer.invoke('state:clear'),
        subscribe: (key: string, callback: Function) => {
            ipcRenderer.on(`state:${key}`, (event, value) => callback(value));
            return () => {
                ipcRenderer.removeAllListeners(`state:${key}`);
            };
        }
    }
}
); 