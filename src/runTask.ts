import { type Task } from './getAllTasks.ts';
import { getTasksFor } from './getTasksFor.ts';
import { format, logger } from './lib/logger.ts';
import { relative } from 'https://deno.land/std@0.208.0/path/mod.ts';

let stop = false;

export const runTask = async (
	task: Task,
	args: string[],
) => {
	const isGuTask = task.name.startsWith('.gu/');
	const localPath = './' + relative(Deno.cwd(), task.path);

	if (stop) {
		if (!isGuTask) {
			logger.alert(`skipped`, { aside: task.name });
		}
		return;
	}

	try {
		const start = Date.now();

		if (!isGuTask) {
			console.log(format.rule(task.name));

			const beforeTasks = await getTasksFor(
				'.gu/before-' + task.name,
			);

			for (const beforeTask of beforeTasks) {
				await runTask(beforeTask, args);
			}
		}

		logger.info(`running`, { aside: localPath });

		const status = await new Deno.Command(task.path, { args }).spawn().status;

		if (!status.success) {
			if (status.signal === 'SIGINT') {
				if (!isGuTask) {
					logger.alert(`stopped`, { aside: localPath });
				}
				return;
			}
			logger.error(`failed`, { aside: localPath });
			Deno.exit(1);
		}

		if (!isGuTask) {
			const afterTasks = await getTasksFor(
				'.gu/after-' + task.name,
			);

			for (const afterTask of afterTasks) {
				await runTask(afterTask, args);
			}
			logger.success(`done`, { aside: `${Date.now() - start}ms` });
		}
	} catch (error) {
		if (error.name === 'NotFound') {
			if (!isGuTask) {
				logger.error(`does not exist`, { aside: localPath });
				Deno.exit(1);
			}
			console.log('wegfwefewfwefwe');
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
