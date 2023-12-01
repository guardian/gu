import { getAllTasks } from '../getAllTasks.ts';
import { getTaskNameFromPath } from '../lib/getTaskNameFromPath.ts';
import { format, logger } from '../lib/logger.ts';

export const listTasks = async () => {
	const tasks = await getAllTasks();

	const projectTasks = tasks.filter((task) => !task.name.startsWith('.gu/'));

	const message = ['Available tasks:', ''];

	for (const task of projectTasks) {
		message.push(format.cmd('gu ' + getTaskNameFromPath(task.name)));
	}

	message.push(
		'',
		'Run ' + format.cmd('gu --help') + ' for more information.',
	);

	logger.help(message.join('\n'));
};
