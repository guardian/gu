import { exec as _exec } from './src/lib/exec.ts';

export { type Config, type Dependency } from './src/getConfig.ts';
export { checkNode } from './src/helpers/check-node.ts';

export const exec = (string: string) => async () => {
	const [command, ...args] = string.split(' ');
	return _exec(command, { args });
};
