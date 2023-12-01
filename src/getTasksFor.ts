import { globToRegExp } from 'https://deno.land/std@0.208.0/path/glob_to_regexp.ts';
import { getAllTasks } from './getAllTasks.ts';

export const getTasksFor = async (name: string) =>
	(await getAllTasks()).filter((task) => globToRegExp(name).test(task.name));
