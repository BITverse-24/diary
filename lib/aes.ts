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
	return Buffer.from(
		await argon2.hash(password, {
			type: argon2.argon2id,
			hashLength: 64,
			salt: salt,
			timeCost: 3,
			memoryCost: 32768,
			parallelism: 4,
			raw: true
		})
	);
}

export async function encryptData(data: Buffer, password: string) {
	const salt = crypto.randomBytes(SALT_LENGTH);

	const seed = await deriveKey(password, salt);

	if (seed.length !== 64) {
		throw new Error(`Invalid seed length: ${seed.length}. Expected 64 bytes.`);
	}

	const mlkem = new MlKem768();
	const [publicKey, privateKey] = await mlkem.deriveKeyPair(seed);

	const pkIv = crypto.randomBytes(NONCE_LENGTH);
	const pkCipher = crypto.createCipheriv(CIPHER_ALGORITHM, seed.subarray(0, 32), pkIv);
	const encPrivateKey = Buffer.concat([pkCipher.update(privateKey), pkCipher.final()]);
	const pkAuthTag = pkCipher.getAuthTag();

	const [kyberCiphertext, sessionKey] = await mlkem.encap(publicKey);

	const dataIv = crypto.randomBytes(NONCE_LENGTH);
	const dataCipher = crypto.createCipheriv(CIPHER_ALGORITHM, sessionKey, dataIv);
	const dataCiphertext = Buffer.concat([dataCipher.update(data), dataCipher.final()]);
	const dataAuthTag = dataCipher.getAuthTag();

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

	return encryptedBlob.toString('base64');
}

export async function decryptData(encryptedBlob: string, password: string): Promise<Buffer> {
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
	return Buffer.concat([dataDecipher.update(dataCiphertext), dataDecipher.final()]);
}

async function testEncryption() {
	const password = "StrongPassword123";
	const plaintext = Buffer.from("My secret diary entry", "utf-8");

	const encryptedText = await encryptData(plaintext, password);
	console.log(`Encrypted: \n${encryptedText}\n\n`);

	const decryptedText = await decryptData(encryptedText, password);
	console.log(`Decrypted: ${decryptedText.toString("utf-8")}`);
}

if (require.main === module)
	testEncryption().catch(console.error);

