import { exists } from 'https://deno.land/std@0.208.0/fs/exists.ts';

import { logger } from '../../lib/logger.ts';
import { shouldInstallNodeModules } from './should-install-node_modules.ts';
import { storeNodeModulesLastModified } from './node_modules.ts';
import { storeLockfileHash } from './lockfile.ts';
import { execAsGu } from '../../lib/exec-as-gu.ts';

const packageManagers = {
	npm: {
		lockfile: 'package-lock.json',
		command: 'npm install',
	},
	yarn: {
		lockfile: 'yarn.lock',
		command: 'yarn install --frozen-lockfile',
	},
	pnpm: {
		lockfile: 'pnpm-lock.yaml',
		command: 'pnpm install --frozen-lockfile',
	},
} as const;

type PackageManagerName = keyof typeof packageManagers;
type PackageManager = typeof packageManagers[PackageManagerName];

let packageManager: PackageManager = packageManagers['npm'];

for (const _ of Object.values(packageManagers)) {
	if (await exists(_.lockfile)) {
		packageManager = _ as PackageManager;
		break;
	}
}

export const installNodeModules = async () => {
	if (await shouldInstallNodeModules(packageManager.lockfile)) {
		await execAsGu(`corepack`, {
			args: packageManager.command.split(' '),
		});
		await Promise.all([
			storeNodeModulesLastModified(),
			storeLockfileHash(packageManager.lockfile),
		]);
	}

	logger.success(`dependencies`, { aside: `up to date` });
};
