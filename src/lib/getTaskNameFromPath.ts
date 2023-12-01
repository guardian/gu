import { extname } from 'https://deno.land/std@0.205.0/path/mod.ts';

export const getTaskNameFromPath = (task: string) =>
	task.replace(extname(task), '');
