import { resolve } from 'https://deno.land/std@0.208.0/path/resolve.ts';
import { crypto } from 'https://deno.land/std@0.208.0/crypto/crypto.ts';
import { LOCKFILE_HASHES } from './keys.ts';

const kv = await Deno.openKv();

export const storeLockfileHash = async (lockfile: string) => {
	const lockFilePath = resolve(Deno.cwd(), lockfile);
	return await kv.set(
		[LOCKFILE_HASHES, lockFilePath],
		await getLocalLockfileHash(lockfile),
	);
};

export const getStoredLockfileHash = async (lockfile: string) => {
	const lockFilePath = resolve(Deno.cwd(), lockfile);
	const stored = await kv.get([LOCKFILE_HASHES, lockFilePath]);
	if (stored.value) {
		return stored?.value as string;
	}
	return '';
};

export const getLocalLockfileHash = async (lockfile: string) => {
	const lockFilePath = resolve(Deno.cwd(), lockfile);
	const lockfileData = await Deno.readFile(lockFilePath);

	// MD5 is fine for this. We're not trying to be secure, just detect changes
	// ASAP.
	const buffer = await crypto.subtle.digest('MD5', lockfileData);
	return Array.from(new Uint8Array(buffer))
		.map((_) => _.toString(16).padStart(2, '0'))
		.join('');
};
