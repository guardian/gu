import { getAllScripts } from '../getAllScripts.ts';
import { getScriptNameFromPath } from '../getScriptNameFromPath.ts';
import { format, logger } from '../lib/logger.ts';

export const listScripts = async () => {
	const tasks = await getAllScripts();

	const projectTasks = tasks.filter((task) => !task.name.startsWith('.gu/'));

	const message = ['Available tasks:', ''];

	for (const task of projectTasks) {
		message.push(format.cmd('gu ' + getScriptNameFromPath(task.name)));
	}

	message.push(
		'',
		'Run ' + format.cmd('gu --help') + ' for more information.',
	);

	logger.help(message.join('\n'));
};
