import { globToRegExp } from 'https://deno.land/std@0.208.0/path/glob_to_regexp.ts';
import { getAllScripts } from './getAllScripts.ts';

export const getScriptsForScriptName = async (name: string) =>
	(await getAllScripts()).filter((task) => globToRegExp(name).test(task.name));
