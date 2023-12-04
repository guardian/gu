/**
 * This is an example of a gu.config.{t,j}s file.
 *
 * It allows you to define dependencies between scripts.
 *
 * It can be written in either TypeScript or JavaScript.
 */

import { checkNode } from './helpers/check-node.ts';
import { type Config } from './src/getConfig.ts';

const lintDependency = async () => {
	console.log('lint dependency');
};

export default {
	// applies to all scripts
	'*': {
		dependencies: [checkNode],
	},
	e2e: {
		dependencies: [async () => {
			console.log('e2e dependency');
		}],
	},
	lint: {
		dependencies: [lintDependency],
	},

	// There is no `./scripts/validate` script, but you can still define dependencies.
	// In theory, this means you can use `gu` without any scripts at all, just
	// by defining dependencies in a config file.
	validate: {
		dependencies: ['e2e', 'lint', 'test'],
	},
} satisfies Config;
