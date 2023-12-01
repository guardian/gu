#!/usr/bin/env deno run --allow-read --allow-run

/**
 * Entry file for the `gu` cli.
 */

import { parse } from 'https://deno.land/std@0.205.0/flags/mod.ts';
import { getTasksFor } from './src/getTasksFor.ts';
import { showHelp } from './src/messages/showHelp.ts';
import { format, logger } from './src/lib/logger.ts';
import { listTasks } from './src/messages/listTasks.ts';
import { runTask } from './src/runTask.ts';
import { checkNode } from './src/verify-node.ts';

export async function runTasks(tasks: string[] = [], args: string[] = []) {
	/**
	 * No built in flags were passed, so now we look for tasks to run.
	 */

	const taskList = ['.gu/before-all', ...tasks, '.gu/after-all'];

	// run the tasks
	for (const taskName of taskList) {
		const tasksForArg = await getTasksFor(String(taskName));
		const isArgTask = !String(taskName).startsWith('.gu/');

		if (isArgTask && tasksForArg.length === 0) {
			logger.error(`no task for '${taskName}' found`);
			logger.log(`run ${format.cmd('gu --list')} to see this project's tasks`);
			logger.log(`run ${format.cmd('gu --help')} for more information`);
			Deno.exit(1);
		}

		for (const taskForArg of tasksForArg) {
			await runTask(taskForArg, args);
		}
	}
}

if (import.meta.main) {
	const args = parse(Deno.args, {
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
