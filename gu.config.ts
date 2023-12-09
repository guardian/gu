/**
 * This is an example of a gu.config.{t,j}s file.
 *
 * It allows you to define dependencies between scripts.
 *
 * It can be written in either TypeScript or JavaScript.
 */

import { checkNode, exec } from './mod.ts';

import { type Config } from './mod.ts';

const lintDependency = async () => {
	console.log(
		'I\'m a lint dependency doing something useful before `lint` runs...',
	);
};

export default {
	// applies to all scripts
	'**/*': {
		dependencies: [checkNode],
	},
	build: {
		description: 'Creates a cross-platform `gu` binary',
	},
	e2e: {
		dependencies: [async () => {
			console.log('e2e dependency');
		}],
		description: 'just a demo script',
	},
	lint: {
		dependencies: [lintDependency],
		description: 'Runs deno\'s linter',
	},
	long: {
		description: 'A example of a long-running script',
	},

	// There is no `./scripts/validate` script, but you can define phony scripts.
	// In theory, this means you can use `gu` without any scripts at all, just
	// by defining phony scripts with dependencies in a config file.
	validate: {
		dependencies: ['e2e', 'lint', 'test'],
		phony: true,
	},
	a: {
		dependencies: [exec('echo "hi"')],
		description: 'a script',
		phony: true,
	},
} satisfies Config;
