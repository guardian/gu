/**
 * Entry file for the `gu` cli.
 */

import { parseArgs } from 'https://deno.land/std@0.208.0/cli/parse_args.ts';
import { getScriptsForTask } from './src/getScriptsForTask.ts';
import { showHelp } from './src/messages/showHelp.ts';
import { format, logger } from './src/lib/logger.ts';
import { listTasks } from './src/messages/listTasks.ts';
import { runScript } from './src/runScript.ts';
import { checkNode } from './src/verify-node.ts';

export async function runTasks(userTasks: string[] = [], args: string[] = []) {
	const tasksToRun = ['.gu/before-all', ...userTasks, '.gu/after-all'];

	// run the tasks
	for (const taskToRun of tasksToRun) {
		const isUserTask = !taskToRun.startsWith('.gu/');

		const [task, ...taskArgs] = taskToRun.split(' ');
		const scriptsForTask = await getScriptsForTask(task);

		if (isUserTask && scriptsForTask.length === 0) {
			logger.error(
				`could not find anything in ./scripts that matches '${task}'`,
			);
			logger.log(`run ${format.cmd('gu --list')} to see this project's tasks`);
			logger.log(`run ${format.cmd('gu --help')} for more information`);
			Deno.exit(1);
		}

		for (const script of scriptsForTask) {
			await runScript(script, [...taskArgs, ...args]);
		}
	}
}

if (import.meta.main) {
	const args = parseArgs(Deno.args, {
		boolean: ['help', 'version', 'list', 'verify-node'],
		alias: { help: 'h', version: 'v', list: ['l'] },
		'--': true,
	});

	/**
	 * gu has some built in flags that don't correspond to tasks e.g. --help etc.
	 * If any of them have been passed, respond accordingly.
	 */

	if (args.help) {
		showHelp();
		Deno.exit(0);
	}

	if (args.version) {
		console.log('no one knows the version...');
		Deno.exit(0);
	}

	if (args['verify-node']) {
		try {
			await checkNode();
			Deno.exit(0);
		} catch (error) {
			if (error.message) {
				console.error(error);
			}
			Deno.exit(1);
		}
	}

	if (args.list) {
		await listTasks();
		Deno.exit(0);
	}

	if (args._.length === 0) {
		await listTasks();
		Deno.exit(1);
	}

	runTasks(args._.map((arg) => String(arg)), args['--']);
}
