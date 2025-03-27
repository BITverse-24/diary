import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { logger } from '@/lib/logger';
import registerAllIPCHandlers from "./handler";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        // frame: false,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            sandbox: true
        }
    });

    mainWindow.setContentProtection(true);

    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'X-Frame-Options': ['DENY'],
                'X-Content-Type-Options': ['nosniff'],
                'Referrer-Policy': ['strict-origin-when-cross-origin']
            }
        });
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    logger.info('Main window created', {
        width: 1200,
        height: 800,
        env: process.env.NODE_ENV
    });
}

async function initialize() {
    try {
        registerAllIPCHandlers();
        createWindow();

        logger.info('Application initialized successfully');
    } catch (error) {
        logger.error('Failed to initialize application', { error });
        app.quit();
    }
}

app.whenReady().then(initialize);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        logger.info('All windows closed, quitting application');
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        logger.info('Activating application, creating new window');
        createWindow();
    }
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { error });
    app.quit();
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection', { reason, promise });
});
