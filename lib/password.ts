'use server'

export default async function verifyPassword(password: string) {
	return password === process.env['PASSWORD'];
}
