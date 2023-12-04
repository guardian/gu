import { expandGlob } from 'https://deno.land/std@0.208.0/fs/expand_glob.ts';

export type Dependency = string | (() => void) | (() => Promise<void>);
export type Config = Record<string, {
	dependencies?: Dependency[];
	description?: string;
}>;

let config: Config | undefined;

export const getConfig = async () => {
	if (!config) {
		for await (const file of expandGlob(`${Deno.cwd()}/gu.config.*`)) {
			config = (await import(file.path)).default;
			break;
		}
	}
	return config ?? {};
};
