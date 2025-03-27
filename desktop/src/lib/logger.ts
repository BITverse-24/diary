import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

// Sensitive data patterns to redact
const SENSITIVE_PATTERNS = [
	/password/i,
	/token/i,
	/key/i,
	/secret/i,
	/credit.?card/i,
	/ssn/i
];

// Log levels
export enum LogLevel {
	DEBUG = 'DEBUG',
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR'
}

// Log entry interface
interface LogEntry {
	timestamp: string;
	level: LogLevel;
	message: string;
	data?: any;
}

class Logger {
	private logFile: string;
	private maxLogSize: number = 5 * 1024 * 1024; // 5MB
	private maxLogFiles: number = 5;

	constructor() {
		const logDir = path.join(app.getPath('userData'), 'logs');
		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir, { recursive: true });
		}
		this.logFile = path.join(logDir, 'app.log');
	}

	// Redact sensitive data from an object
	private redactSensitiveData(data: any): any {
		if (!data) return data;

		if (typeof data === 'string') {
			return SENSITIVE_PATTERNS.some(pattern => pattern.test(data))
				? '[REDACTED]'
				: data;
		}

		if (typeof data === 'object') {
			const redacted = { ...data };
			for (const key in redacted) {
				if (SENSITIVE_PATTERNS.some(pattern => pattern.test(key))) {
					redacted[key] = '[REDACTED]';
				} else {
					redacted[key] = this.redactSensitiveData(redacted[key]);
				}
			}
			return redacted;
		}

		return data;
	}

	// Rotate log file if it exceeds max size
	private rotateLogFile() {
		if (fs.existsSync(this.logFile)) {
			const stats = fs.statSync(this.logFile);
			if (stats.size >= this.maxLogSize) {
				// Rotate existing log files
				for (let i = this.maxLogFiles - 1; i > 0; i--) {
					const oldFile = `${this.logFile}.${i}`;
					const newFile = `${this.logFile}.${i + 1}`;
					if (fs.existsSync(oldFile)) {
						fs.renameSync(oldFile, newFile);
					}
				}
				// Move current log file to .1
				fs.renameSync(this.logFile, `${this.logFile}.1`);
			}
		}
	}

	// Write log entry to file
	private writeLog(entry: LogEntry) {
		this.rotateLogFile();
		const logLine = JSON.stringify(entry) + '\n';
		fs.appendFileSync(this.logFile, logLine);
	}

	// Format log entry
	private formatLog(level: LogLevel, message: string, data?: any): LogEntry {
		return {
			timestamp: new Date().toISOString(),
			level,
			message,
			data: this.redactSensitiveData(data)
		};
	}

	// Public logging methods
	public debug(message: string, data?: any) {
		this.writeLog(this.formatLog(LogLevel.DEBUG, message, data));
	}

	public info(message: string, data?: any) {
		this.writeLog(this.formatLog(LogLevel.INFO, message, data));
	}

	public warn(message: string, data?: any) {
		this.writeLog(this.formatLog(LogLevel.WARN, message, data));
	}

	public error(message: string, data?: any) {
		this.writeLog(this.formatLog(LogLevel.ERROR, message, data));
	}
}

// Export singleton instance
export const logger = new Logger();
