'use server'

export default async function verifyPassword(password: string) {
	console.log(`Given password: ${password} | Expected password: ${process.env['PASSWORD'] as string}`)

	return password === process.env['PASSWORD'] as string;
}
