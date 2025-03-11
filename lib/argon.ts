import argon2 from 'argon2';

export default async function deriveSeed(password: string, salt: Buffer): Promise<Buffer> {
	const argon2Options = {
		type: argon2.argon2id,
		hashLen: 64,
		time: 3,
		mem: 32768,
		parallelism: 4,
	};
	return await argon2.hash(password, { salt, ...argon2Options, raw: true });
}
