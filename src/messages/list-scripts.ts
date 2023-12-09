import { blue, dim } from 'https://deno.land/std@0.208.0/fmt/colors.ts';
import { getAllScripts } from '../get-all-scripts.ts';
import { getConfig } from '../get-config.ts';
import { getScriptNameFromPath } from '../get-script-name-from-path.ts';
import { format, logger } from '../lib/logger.ts';

export const listScripts = async () => {
	const scripts = await getAllScripts();
	const config = await getConfig();

	const message = [''];

	for (const script of scripts) {
		let prompt = format.cmd('gu ' + getScriptNameFromPath(script.name));
		const description = config[script.name]?.description;
		if (description) {
			prompt += ' ' + dim(blue(description.toLocaleLowerCase()));
		}
		message.push(prompt);
	}

	const phonies = [];

	for (const [name, options] of Object.entries(config)) {
		if (options.phony) {
			let prompt = format.cmd('gu ' + name);
			const description = options.description ??
				`runs ${options.dependencies?.join(', ')}`;
			if (description) {
				prompt += ' ' + dim(blue(description.toLocaleLowerCase()));
			}
			phonies.push(prompt);
		}
	}

	if (phonies.length > 0) {
		message.push(
			'',
			dim('The following phony scripts are defined in ./gu.config.ts:'),
		);
		message.push(...phonies);
	}

	message.push(
		'',
		'Run ' + format.cmd('gu --help') + ' for more information.',
	);

	logger.help('Available tasks');
	console.log(message.join('\n'));
};
