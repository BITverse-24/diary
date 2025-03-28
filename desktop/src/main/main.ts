import { app, BrowserWindow, globalShortcut, powerMonitor } from 'electron';
import * as path from 'path';
import { logger } from '../lib/logger';
import registerAllIPCHandlers from "./handler";
import CopyPrevention from "../lib/CopyPrevention";

let mainWindow: BrowserWindow | null = null;
const inactivityTimeoutSeconds = 300;


function createWindow() {
    mainWindow = new BrowserWindow({
        frame: false,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            sandbox: true
        }
    });

    mainWindow.setContentProtection(true);
    CopyPrevention.disableCopy(mainWindow);
    CopyPrevention.addCopyDeterrent(mainWindow);
    CopyPrevention.enableCopyAttemptLogging(mainWindow);

    globalShortcut.register('Ctrl+Shift+L', () => {
        if (mainWindow) {
            mainWindow.hide();
        }
        console.log('Lock hotkey pressed: UI locked.');
    });

    setInterval(() => {
        const idleTime = powerMonitor.getSystemIdleTime();
        if (idleTime >= inactivityTimeoutSeconds && mainWindow && mainWindow.isVisible()) {
            mainWindow.hide();
            mainWindow.minimize();
            console.log('Inactivity detected: UI locked and minimized.');
        }
    }, 1000);

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

    mainWindow.loadURL('http://localhost:3000');

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
        // registerAllIPCHandlers();
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
