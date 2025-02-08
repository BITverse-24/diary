import crypto from "crypto";

const SALT_LENGTH = 16; // 128-bit salt
const NONCE_LENGTH = 12; // 96-bit nonce
const KEY_LENGTH = 32; // 256-bit key
const ITERATIONS = 100000; // PBKDF2 iterations
const HASH_ALGORITHM = "sha256";
const CIPHER_ALGORITHM = "aes-256-gcm";

/**
 * Derives a cryptographic key from a password using PBKDF2.
 */
function deriveKey(password: string, salt: Buffer): Buffer {
	return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, HASH_ALGORITHM);
}

/**
 * Encrypts data using AES-GCM with a password-derived key.
 */
function encryptData(data: Buffer, password: string): string {
	const salt = crypto.randomBytes(SALT_LENGTH);
	const key = deriveKey(password, salt);
	const nonce = crypto.randomBytes(NONCE_LENGTH);

	const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, key, nonce);
	const ciphertext = Buffer.concat([cipher.update(data), cipher.final()]);
	const authTag = cipher.getAuthTag(); // Get the authentication tag

	return Buffer.concat([salt, nonce, ciphertext, authTag]).toString("base64");
}

/**
 * Decrypts an encrypted blob using AES-GCM.
 */
function decryptData(encryptedBlob: string, password: string): Buffer {
	const encryptedData = Buffer.from(encryptedBlob, "base64");

	const salt = encryptedData.subarray(0, SALT_LENGTH);
	const nonce = encryptedData.subarray(SALT_LENGTH, SALT_LENGTH + NONCE_LENGTH);
	const ciphertext = encryptedData.subarray(SALT_LENGTH + NONCE_LENGTH, -16);
	const authTag = encryptedData.subarray(-16);

	const key = deriveKey(password, salt);
	const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, key, nonce);
	decipher.setAuthTag(authTag);

	return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}


// const password = "StrongPassword123";
// const plaintext = "My secret data";
//
// // Encrypt
// const encryptedText = encryptData(Buffer.from(plaintext, "utf-8"), password);
// console.log(`Encrypted: ${encryptedText}`);
//
// // Decrypt
// const decryptedText = decryptData(encryptedText, password);
// console.log(`Decrypted: ${decryptedText.toString("utf-8")}`);
