'use server'

import { MlKem768 } from 'crystals-kyber-js';
import argon2 from 'argon2';
import crypto from 'crypto';

const SALT_LENGTH = 16;
const NONCE_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const ENC_PRIVATE_KEY_LENGTH = 2400;
const KYBER_CIPHERTEXT_LENGTH = 1088;
const CIPHER_ALGORITHM = 'aes-256-gcm';

async function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
    console.log('--- Deriving Key ---\n');
    console.log(`Password: ${password}\n`);
    console.log(`Salt (${SALT_LENGTH} bytes): ${Buffer.from(salt).toString('hex')}\n`);

    const derived = await argon2.hash(password, {
        type: argon2.argon2id,
        hashLength: 64,
        salt: salt,
        timeCost: 3,
        memoryCost: 32768,
        parallelism: 4,
        raw: true
    });
    const key = Buffer.from(derived);
    console.log(`Derived Seed (64 bytes): ${Buffer.from(key).toString('hex')}\n`);
    return key;
}

export async function encryptData(text: string, password: string): Promise<string> {
    console.log('--- Encryption Process Started ---\n');
    console.log(`Plaintext: ${text}`);

    const data = Buffer.from(text, 'utf8');

    // Generate salt and derive key
    const salt = crypto.randomBytes(SALT_LENGTH);
    console.log(`Generated Salt (${SALT_LENGTH} bytes): ${Buffer.from(salt).toString('hex')}`);
    const seed = await deriveKey(password, salt);

    if (seed.length !== 64)
        throw new Error(`Invalid seed length: ${seed.length}. Expected 64 bytes.`);

    // Key pair derivation using Kyber-based KEM
    const mlkem = new MlKem768();
    console.log('--- Deriving Key Pair ---\n');
    const [publicKey, privateKey] = await mlkem.deriveKeyPair(seed);
    console.log(`Public Key: ${Buffer.from(publicKey).toString('hex')}`);
    console.log(`Private Key: ${Buffer.from(privateKey).toString('hex').substring(0, 64)}... [truncated]`);

    // Encrypt the private key with AES-256-GCM
    const pkIv = crypto.randomBytes(NONCE_LENGTH);
    console.log(`Private Key Encryption IV (${NONCE_LENGTH} bytes): ${Buffer.from(pkIv).toString('hex')}`);
    const pkCipher = crypto.createCipheriv(CIPHER_ALGORITHM, seed.subarray(0, 32), pkIv);
    const encPrivateKey = Buffer.concat([pkCipher.update(privateKey), pkCipher.final()]);
    const pkAuthTag = pkCipher.getAuthTag();
    console.log(`\nEncrypted Private Key: ${Buffer.from(encPrivateKey).toString('hex').substring(0, 64)}... [truncated]`);
    console.log(`\nPrivate Key Auth Tag (${AUTH_TAG_LENGTH} bytes): ${Buffer.from(pkAuthTag).toString('hex')}`);

    // Encapsulate session key using Kyber KEM
    console.log('--- Encapsulating Session Key ---');
    const [kyberCiphertext, sessionKey] = await mlkem.encap(publicKey);
    console.log(`\nKyber Ciphertext (${KYBER_CIPHERTEXT_LENGTH} bytes): ${Buffer.from(kyberCiphertext).toString('hex').substring(0, 64)}... [truncated]`);
    console.log(`\nSession Key: ${Buffer.from(sessionKey).toString('hex')}`);

    // Encrypt the data with session key using AES-256-GCM
    const dataIv = crypto.randomBytes(NONCE_LENGTH);
    console.log(`\nData Encryption IV (${NONCE_LENGTH} bytes): ${Buffer.from(dataIv).toString('hex')}`);
    const dataCipher = crypto.createCipheriv(CIPHER_ALGORITHM, sessionKey, dataIv);
    const dataCiphertext = Buffer.concat([dataCipher.update(data), dataCipher.final()]);
    const dataAuthTag = dataCipher.getAuthTag();
    console.log(`\nEncrypted Data: ${Buffer.from(dataCiphertext).toString('hex').substring(0, 64)}... [truncated]`);
    console.log(`\nData Auth Tag (${AUTH_TAG_LENGTH} bytes): ${Buffer.from(dataAuthTag).toString('hex')}`);

    // Build the final encrypted blob
    const encryptedBlob = Buffer.concat([
        salt,
        pkIv,
        pkAuthTag,
        encPrivateKey,
        kyberCiphertext,
        dataIv,
        dataAuthTag,
        dataCiphertext
    ]);
    console.log('--- Encryption Process Completed ---\n');
    console.log(`\nFinal Encrypted Blob (base64): ${encryptedBlob.toString('base64').substring(0, 64)}... [truncated]\n`);

    return encryptedBlob.toString('base64');
}

export async function decryptData(encryptedBlob: string, password: string): Promise<string> {
    const encryptedData = Buffer.from(encryptedBlob, 'base64');

    let offset = 0;
    const salt = encryptedData.subarray(offset, offset + SALT_LENGTH);
    offset += SALT_LENGTH;
    const pkIv = encryptedData.subarray(offset, offset + NONCE_LENGTH);
    offset += NONCE_LENGTH;
    const pkAuthTag = encryptedData.subarray(offset, offset + AUTH_TAG_LENGTH);
    offset += AUTH_TAG_LENGTH;
    const encPrivateKey = encryptedData.subarray(offset, offset + ENC_PRIVATE_KEY_LENGTH);
    offset += ENC_PRIVATE_KEY_LENGTH;
    const kyberCiphertext = encryptedData.subarray(offset, offset + KYBER_CIPHERTEXT_LENGTH);
    offset += KYBER_CIPHERTEXT_LENGTH;
    const dataIv = encryptedData.subarray(offset, offset + NONCE_LENGTH);
    offset += NONCE_LENGTH;
    const dataAuthTag = encryptedData.subarray(offset, offset + AUTH_TAG_LENGTH);
    offset += AUTH_TAG_LENGTH;
    const dataCiphertext = encryptedData.subarray(offset);

    const seed = await deriveKey(password, salt);

    if (seed.length !== 64) {
        throw new Error(`Invalid seed length: ${seed.length}. Expected 64 bytes.`);
    }

    const pkDecipher = crypto.createDecipheriv(CIPHER_ALGORITHM, seed.subarray(0, 32), pkIv);
    pkDecipher.setAuthTag(pkAuthTag);
    const privateKey = Buffer.concat([pkDecipher.update(encPrivateKey), pkDecipher.final()]);

    const mlkem = new MlKem768();
    const sessionKey = await mlkem.decap(kyberCiphertext, privateKey);

    const dataDecipher = crypto.createDecipheriv(CIPHER_ALGORITHM, sessionKey, dataIv);
    dataDecipher.setAuthTag(dataAuthTag);
    return Buffer.concat([dataDecipher.update(dataCiphertext), dataDecipher.final()]).toString('utf-8');
}



async function testEncryption() {
	const password = "StrongPassword123";

	const encryptedText = await encryptData("My secret diary entry", password);

	const decryptedText = await decryptData(encryptedText, password);
	console.log(`Decrypted: ${decryptedText}`);
}

if (require.main === module)
	testEncryption().catch(console.error);

