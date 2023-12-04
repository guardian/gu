import { blue, dim } from 'https://deno.land/std@0.208.0/fmt/colors.ts';
import { getAllScripts } from '../getAllScripts.ts';
import { getConfig } from '../getConfig.ts';
import { getScriptNameFromPath } from '../getScriptNameFromPath.ts';
import { format, logger } from '../lib/logger.ts';

export const listScripts = async () => {
	const scripts = await getAllScripts();
	const config = await getConfig();

	const message = ['Available tasks:', ''];

	for (const script of scripts) {
		let prompt = format.cmd('gu ' + getScriptNameFromPath(script.name));
		const description = config[script.name]?.description;
		if (description) {
			prompt += ' ' + dim(blue(description.toLocaleLowerCase()));
		}
		message.push(prompt);
	}

	message.push(
		'',
		'Run ' + format.cmd('gu --help') + ' for more information.',
	);

	logger.help(message.join('\n'));
};
