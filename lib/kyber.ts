import { MlKem768 } from 'crystals-kyber-js';

export default async function genKeypair(data: Buffer, password: string, derivedKey: Buffer): Promise<Uint8Array[]> {
	const mlKem = new MlKem768();
	return await mlKem.deriveKeyPair(derivedKey);
}
