import { type Script } from './get-all-scripts.ts';
import { execAsGu } from './lib/exec-as-gu.ts';
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

	await execAsGu(script.path, {
		args,
		env: { GU_CHILD_PROCESS: 'true' },
	});
};

Deno.addSignalListener('SIGINT', () => {
	stop = true;
	console.log('');
	logger.quiet(`Received 'SIGINT', stopping...`);
});
