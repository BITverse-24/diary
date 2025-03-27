import { ipcMain, webContents } from 'electron';

class CopyPrevention {
	/**
	 * Completely disable copy-related actions across the application
	 * @param mainWindow The main Electron BrowserWindow instance
	 */
	public static disableCopy(mainWindow: Electron.BrowserWindow) {
		// Disable context menu copy options
		mainWindow.webContents.on('context-menu', (event) => {
			event.preventDefault();
		});

		// Intercept and block copy keyboard shortcuts
		mainWindow.webContents.on('before-input-event', (event, input) => {
			// Block Ctrl+C, Cmd+C, and other copy-related shortcuts
			const copyShortcuts = [
				{ key: 'c', ctrlKey: true },
				{ key: 'c', metaKey: true },
				{ key: 'Insert', ctrlKey: true }
			];

			const isBlockedShortcut = copyShortcuts.some(shortcut =>
				input.key.toLowerCase() === shortcut.key &&
				(input.control === shortcut.ctrlKey || input.meta === shortcut.metaKey)
			);

			if (isBlockedShortcut && input.type === 'keyDown') {
				event.preventDefault();
			}
		});

		// Disable copy-related browser events
		mainWindow.webContents.executeJavaScript(`
      (() => {
        // Prevent text selection
        document.addEventListener('selectstart', (e) => e.preventDefault());

        // Block copy events
        document.addEventListener('copy', (e) => e.preventDefault(), true);

        // Disable right-click context menu
        document.addEventListener('contextmenu', (e) => e.preventDefault(), true);

        // Remove text selection styling
        const style = document.createElement('style');
        style.innerHTML = \`
          * {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-user-drag: none;
            user-drag: none;
          }
        \`;
        document.head.appendChild(style);

        // Override clipboard-related methods
        Object.defineProperties(document, {
          'oncopy': {
            value: null,
            writable: false
          }
        });

        // Prevent clipboard access
        if (navigator.clipboard) {
          navigator.clipboard.writeText = () => Promise.reject('Copy is disabled');
          navigator.clipboard.write = () => Promise.reject('Copy is disabled');
        }
      })();
    `);

		// Additional IPC handler to prevent any programmatic copy attempts
		ipcMain.on('prevent-copy', (event) => {
			event.returnValue = false;
		});
	}

	/**
	 * Optionally add a watermark or additional visual deterrent
	 * @param mainWindow The main Electron BrowserWindow instance
	 */
	public static addCopyDeterrent(mainWindow: Electron.BrowserWindow) {
		mainWindow.webContents.executeJavaScript(`
      (() => {
        // Create a subtle watermark
        const watermark = document.createElement('div');
        watermark.style.position = 'fixed';
        watermark.style.bottom = '10px';
        watermark.style.right = '10px';
        watermark.style.opacity = '0.3';
        watermark.style.pointerEvents = 'none';
        watermark.style.zIndex = '9999';
        watermark.textContent = 'CONFIDENTIAL';
        document.body.appendChild(watermark);
      })();
    `);
	}

	/**
	 * Logging method for tracking potential copy attempts
	 * @param mainWindow The main Electron BrowserWindow instance
	 */
	public static enableCopyAttemptLogging(mainWindow: Electron.BrowserWindow) {
		mainWindow.webContents.executeJavaScript(`
      (() => {
        const logCopyAttempt = () => {
          console.warn('Copy attempt blocked');
          // You could send this to a logging service or main process
          window.electronAPI.logCopyAttempt();
        };

        document.addEventListener('copy', logCopyAttempt, true);
      })();
    `);

		// IPC handler for logging
		ipcMain.on('log-copy-attempt', () => {
			console.log('Unauthorized copy attempt detected');
			// Implement additional logging or tracking as needed
		});
	}
}

export default CopyPrevention;
