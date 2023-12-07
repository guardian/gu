import { type Script } from './getAllScripts.ts';
import { exec } from './lib/exec.ts';
import { logger } from './lib/logger.ts';

let stop = false;

export const runScript = async (
	script: Script,
	args: string[],
) => {
	if (stop) {
		logger.alert(`skipped`, { aside: script.name });
		return;
	}

	await exec(script.path, {
		args,
		env: { GU_CHILD_PROCESS: 'true' },
	});
};

Deno.addSignalListener('SIGINT', () => {
	stop = true;
	console.log('');
	logger.quiet(`Received 'SIGINT', stopping...`);
});
