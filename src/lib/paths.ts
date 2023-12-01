import { resolve } from 'path';

export const SCRIPTS_DIR_NAME = 'scripts';
export const SCRIPTS_DIR = resolve(Deno.cwd(), SCRIPTS_DIR_NAME);
