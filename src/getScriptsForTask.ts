import { globToRegExp } from 'https://deno.land/std@0.208.0/path/mod.ts';
import { getAllTasks } from './getAllTasks.ts';

export const getScriptsForTask = async (name: string) =>
	(await getAllTasks()).filter((task) => globToRegExp(name).test(task.name));
