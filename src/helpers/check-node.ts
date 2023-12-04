import { format, logger } from '../lib/logger.ts';
import { findNvmrc } from './lib/findNvmrc.ts';

const getVersionOf = async (command: string) => {
	try {
		const result = await new Deno.Command(command, { args: ['--version'] })
			.output();
		if (result.success) return new TextDecoder().decode(result.stdout).trim();
		return undefined;
	} catch (_error) {
		return undefined;
	}
};

const getManagerPrompt = async () => {
	const prompt = (command: string) =>
		`Run ${format.cmd(command)} to install/switch to the correct version.`;

	if (await getVersionOf('fnm')) {
		return [
			prompt('fnm use'),
			`See ${
				format.path('https://github.com/Schniz/fnm#shell-setup')
			} to automate this.`,
		].join('\n');
	}

	if (await getVersionOf('asdf')) {
		return prompt('asdf install');
	}

	if (await getVersionOf('nvm')) {
		return prompt('nvm install');
	}

	return [
		`Consider using ${format.cmd('fnm')} to manage Node versions.`,
		`https://github.com/Schniz/fnm#installation`,
	].join('\n');
};

const validNodeVersion = /\d+\.\d+\.\d+/;

const logNodeVersionError = async (
	{ currentVersion, targetVersion }: {
		currentVersion?: string;
		targetVersion?: string;
	} = {},
) => {
	logger.alert(
		`This project requires Node ${targetVersion ? `v${targetVersion}` : ''}`,
		{
			aside: `found: ${currentVersion ? `v${currentVersion}` : 'none'}`,
			prompt: await getManagerPrompt(),
		},
	);
};

export const checkNode = async () => {
	try {
		const currentVersion = (await getVersionOf('node'))?.replace(/^v/, '');

		if (!currentVersion) {
			await logNodeVersionError();
			throw new Error();
		}

		const nvmrcPath = await findNvmrc();

		if (nvmrcPath) {
			try {
				const targetVersion = (await Deno.readTextFile('.nvmrc'))?.trim();

				if (!validNodeVersion.test(targetVersion)) {
					logger.alert('Invalid Node version found in .nvmrc file', {
						aside: targetVersion,
						prompt: 'It should match the pattern: X.X.X.',
					});
					throw new Error('GU_CHECK_FAILED');
				}

				if (currentVersion !== targetVersion) {
					await logNodeVersionError({ currentVersion, targetVersion });
					throw new Error();
				}
			} catch (error) {
				throw error;
			}
		}

		logger.success(
			`using`,
			{ aside: `Node v${currentVersion}` },
		);
	} catch (error) {
		throw error;
	}
};
