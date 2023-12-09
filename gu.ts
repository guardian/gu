/**
 * Entry file for the `gu` cli.
 */

import { parseArgs } from 'https://deno.land/std@0.208.0/cli/parse_args.ts';
import { globToRegExp } from 'https://deno.land/std@0.208.0/path/glob_to_regexp.ts';
import { checkNode } from './src/helpers/check-node/mod.ts';
import { getScriptsForScriptName } from './src/get-scripts-for-script-name.ts';
import { type Dependency, getConfig } from './src/get-config.ts';
import { format, logger } from './src/lib/logger.ts';
import { listScripts } from './src/messages/list-scripts.ts';
import { showHelp } from './src/messages/show-help.ts';
import { runScript } from './src/run-script.ts';

const history: string[] = [];

export async function runScripts(inputs: string[] = [], flags: string[] = []) {
	// Get any dependencies defined in a gu.config.{t,j}s file
	const config = await getConfig();

	// Try and run scripts referred to by the inputs
	for (const input of inputs) {
		// inputs could be `lint` or `lint --fix` etc.
		const [scriptName, ...scriptArgs] = input.split(' ');

		// get any dependencies for this input
		const scriptDependencies: Dependency[] = [];

		if (config[scriptName]?.phony) {
			for (const [depName, { dependencies }] of Object.entries(config)) {
				if (globToRegExp(depName).test(scriptName) && dependencies) {
					scriptDependencies.push(...dependencies);
				}
			}
		}

		// get a list of scripts that match the input (it could be a glob)
		const scriptsForScriptName = await getScriptsForScriptName(scriptName);

		// if we couldn't find any scripts, and there are no dependencies, then
		// we can't do anything
		if (
			scriptsForScriptName.length === 0 && scriptDependencies.length === 0
		) {
			logger.error(
				`could not find anything in ./scripts that matches '${scriptName}'`,
			);
			logger.log(`run ${format.cmd('gu --list')} to see this project's tasks`);
			logger.log(`run ${format.cmd('gu --help')} for more information`);
			Deno.exit(1);
		}

		// run any dependencies
		for (const scriptDependency of scriptDependencies) {
			switch (typeof scriptDependency) {
				case 'string':
					await runScripts([scriptDependency], flags);
					break;
				case 'function':
					try {
						const depName = scriptDependency.name ??
							scriptDependency.toString();
						if (history.includes(depName)) break;
						await scriptDependency();
						history.push(depName);
					} catch (error) {
						if (error.message === 'GU_CHECK_FAILED') {
							logger.error(`failed`, {
								aside:
									`${scriptDependency.name} (dependency of '${scriptName}')`,
							});
						} else {
							console.error(error);
						}
						Deno.exit(1);
					}
					break;
				default:
					logger.error(
						`dependency is not a string or a function`,
						{
							aside: `'${scriptDependency}' is a ${typeof scriptDependency}`,
						},
					);
					Deno.exit(1);
			}
		}

		for (const script of scriptsForScriptName) {
			if (history.includes(script.name)) continue;
			console.log(format.rule(script.name));
			await runScript(script, [...scriptArgs, ...flags]);
			history.push(script.name);
		}
	}
}

if (import.meta.main) {
	const args = parseArgs(Deno.args, {
		boolean: ['help', 'version', 'list', 'check-node'],
		alias: { help: 'h', version: 'v', list: ['l'] },
		'--': true,
	});

	/**
	 * gu has some built in flags that don't correspond to tasks e.g. --help etc.
	 * If any of them have been passed, respond accordingly.
	 */

	if (args.help) {
		showHelp();
		Deno.exit(0);
	}

	if (args.version) {
		console.log('no one knows the version...');
		Deno.exit(0);
	}

	if (args['check-node']) {
		try {
			await checkNode();
			Deno.exit(0);
		} catch (error) {
			if (error.message) {
				console.error(error);
			}
			Deno.exit(1);
		}
	}

	if (args.list) {
		await listScripts();
		Deno.exit(0);
	}

	if (args._.length === 0) {
		await listScripts();
		Deno.exit(1);
	}

	runScripts(args._.map((arg) => String(arg)), args['--']);
}
