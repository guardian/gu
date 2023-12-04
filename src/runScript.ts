import { type Script } from './getAllScripts.ts';
import { logger } from './lib/logger.ts';
import { relative } from 'https://deno.land/std@0.208.0/path/relative.ts';

let stop = false;

export const runScript = async (
	script: Script,
	args: string[],
) => {
	const localPath = './' + relative(Deno.cwd(), script.path);

	if (stop) {
		logger.alert(`skipped`, { aside: script.name });
		return;
	}

	try {
		const start = Date.now();

		logger.info(`running`, { aside: localPath });

		const status = await new Deno.Command(script.path, {
			args,
			env: { GU_CHILD_PROCESS: 'true' },
		}).spawn().status;

		if (!status.success) {
			if (status.signal === 'SIGINT') {
				logger.alert(`stopped`, { aside: localPath });

				return;
			}
			logger.error(`failed`, { aside: localPath });
			Deno.exit(1);
		}

		logger.success(`done`, { aside: `${Date.now() - start}ms` });
	} catch (error) {
		if (error.name === 'NotFound') {
			logger.error(`does not exist`, { aside: localPath });
			Deno.exit(1);
		}
		console.error(error);
		Deno.exit(1);
	}
};

Deno.addSignalListener('SIGINT', () => {
	stop = true;
	console.log('');
	logger.quiet(`Received 'SIGINT', stopping...`);
});
