import { resolve } from 'https://deno.land/std@0.208.0/path/mod.ts';

export const SCRIPTS_DIR_NAME = 'scripts';
export const SCRIPTS_DIR = resolve(Deno.cwd(), SCRIPTS_DIR_NAME);
