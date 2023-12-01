import { globToRegExp } from 'path';
import { getAllTasks } from './getAllTasks.ts';

export const getTasksFor = async (name: string) =>
	(await getAllTasks()).filter((task) => globToRegExp(name).test(task.name));
