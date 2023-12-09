import { execAsGu } from './src/lib/exec-as-gu.ts';

export { type Config, type Dependency } from './src/get-config.ts';
export { checkNode } from './src/helpers/check-node/mod.ts';
export { installNodeModules } from './src/helpers/install-node-modules/mod.ts';

export const exec = (string: string) => async () => {
	const [command, ...args] = string.split(' ');
	return execAsGu(command, { args });
};
