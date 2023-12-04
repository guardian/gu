import { extname } from 'https://deno.land/std@0.208.0/path/extname.ts';

export const getScriptNameFromPath = (task: string) =>
	task.replace(extname(task), '');
