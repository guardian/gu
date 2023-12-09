import { logger } from './logger.ts';

export const execAsGu = async (
	command: string | URL,
	options?: Deno.CommandOptions,
) => {
	const aside = command.toString() + ' ' + options?.args?.join(' ');

	try {
		const start = Date.now();

		logger.info(`running`, { aside });

		const status = await new Deno.Command(command, options).spawn().status;

		if (!status.success) {
			if (status.signal === 'SIGINT') {
				logger.alert(`stopped`, { aside });

				return;
			}
			logger.error(`failed`, { aside });
			Deno.exit(1);
		}

		logger.success(`done`, { aside: `${Date.now() - start}ms` });
	} catch (error) {
		if (error.name === 'NotFound') {
			logger.error(`does not exist`, { aside });
			Deno.exit(1);
		}
		console.error(error);
		Deno.exit(1);
	}
};
