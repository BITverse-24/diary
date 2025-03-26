import { app } from 'electron';

// Security configuration
export const SECURITY_CONFIG = {
    // Allowed origins for CORS
    ALLOWED_ORIGINS: [
        'http://localhost:3000',
        'http://localhost:5000',
        'app://./' // Electron's protocol
    ],

    // Content Security Policy
    CSP: {
        DEFAULT_SRC: ["'self'"],
        SCRIPT_SRC: ["'self'", "'unsafe-inline'"],
        STYLE_SRC: ["'self'", "'unsafe-inline'"],
        IMG_SRC: ["'self'", 'data:', 'https:'],
        CONNECT_SRC: ["'self'", 'http://localhost:*', 'https://api.example.com'],
        FONT_SRC: ["'self'"],
        OBJECT_SRC: ["'none'"],
        MEDIA_SRC: ["'self'"],
        FRAME_SRC: ["'none'"],
        SANDBOX: ['allow-scripts', 'allow-same-origin']
    },

    // Encryption settings
    ENCRYPTION: {
        ALGORITHM: 'aes-256-gcm',
        KEY_LENGTH: 32,
        IV_LENGTH: 16,
        SALT_LENGTH: 64,
        ITERATIONS: 100000
    },

    // Session settings
    SESSION: {
        TOKEN_EXPIRY: '24h',
        REFRESH_TOKEN_EXPIRY: '7d',
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_DURATION: '15m'
    },

    // File system security
    FILE_SYSTEM: {
        ALLOWED_PATHS: [
            app.getPath('userData'),
            app.getPath('documents')
        ],
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_EXTENSIONS: ['.txt', '.md', '.json']
    }
} as const;

// Type for security configuration
export type SecurityConfig = typeof SECURITY_CONFIG;

// Helper function to get CSP string
export function getCSPString(): string {
    const { CSP } = SECURITY_CONFIG;
    return Object.entries(CSP)
        .map(([key, value]) => `${key.replace(/_/g, '-').toLowerCase()} ${value.join(' ')}`)
        .join('; ');
} 