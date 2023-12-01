import { extname } from 'path';

export const getTaskNameFromPath = (task: string) =>
	task.replace(extname(task), '');
