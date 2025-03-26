import crypto from 'crypto';
import { SECURITY_CONFIG } from '../config/security';

const { ENCRYPTION } = SECURITY_CONFIG;

// Generate a random key
export function generateKey(): Buffer {
    return crypto.randomBytes(ENCRYPTION.KEY_LENGTH);
}

// Generate a random IV
export function generateIV(): Buffer {
    return crypto.randomBytes(ENCRYPTION.IV_LENGTH);
}

// Generate a random salt
export function generateSalt(): Buffer {
    return crypto.randomBytes(ENCRYPTION.SALT_LENGTH);
}

// Derive a key from a password using PBKDF2
export function deriveKey(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(
        password,
        salt,
        ENCRYPTION.ITERATIONS,
        ENCRYPTION.KEY_LENGTH,
        'sha512'
    );
}

// Encrypt data
export function encrypt(data: string, key: Buffer, iv: Buffer): string {
    const cipher = crypto.createCipheriv(
        ENCRYPTION.ALGORITHM,
        key,
        iv
    );

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Get the auth tag
    const authTag = cipher.getAuthTag();

    // Combine IV, encrypted data, and auth tag
    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
}

// Decrypt data
export function decrypt(encryptedData: string, key: Buffer): string {
    // Split the encrypted data into IV, encrypted content, and auth tag
    const [ivHex, encrypted, authTagHex] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(
        ENCRYPTION.ALGORITHM,
        key,
        iv
    );

    // Set the auth tag
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

// Hash data using SHA-256
export function hash(data: string): string {
    return crypto
        .createHash('sha256')
        .update(data)
        .digest('hex');
}

// Compare hashed data
export function compareHash(data: string, hash: string): boolean {
    return hash === crypto
        .createHash('sha256')
        .update(data)
        .digest('hex');
} 