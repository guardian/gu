import { exists } from 'https://deno.land/std@0.208.0/fs/exists.ts';
import { walk } from 'https://deno.land/std@0.208.0/fs/walk.ts';
import { extname } from 'https://deno.land/std@0.208.0/path/extname.ts';
import { relative } from 'https://deno.land/std@0.208.0/path/relative.ts';
import { format, logger } from './lib/logger.ts';
import { SCRIPTS_DIR } from './lib/paths.ts';

export type Script = {
	name: string;
	path: string;
};

const isExecutable = async (filePath: string) => {
	try {
		const stats = await Deno.stat(filePath);
		const isFile = stats.isFile;
		if (stats.mode) {
			const ownerExecutable = (stats.mode & 64) > 0;
			const groupExecutable = (stats.mode & 8) > 0;
			const othersExecutable = (stats.mode & 1) > 0;

			return isFile && (ownerExecutable || groupExecutable || othersExecutable);
		}
		return false;
	} catch (_error) {
		return false;
	}
};

let allScripts: Script[] | undefined;

export const getAllScripts = async () => {
	if (!await exists(SCRIPTS_DIR)) {
		logger.alert(`This directory contains no ./scripts`);
		logger.log(`run ${format.cmd('gu --help')} for more information`);
		Deno.exit(1);
	}

	if (!allScripts) {
		allScripts = [];
		for await (
			const file of walk(SCRIPTS_DIR, {
				includeDirs: false,
				// TODO: skip list needs padding out
				skip: [/\/(node_modules)\//],
			})
		) {
			if (await isExecutable(file.path)) {
				allScripts.push({
					name: relative(
						SCRIPTS_DIR,
						file.path.replace(extname(file.path), ''),
					),
					path: './' + relative(Deno.cwd(), file.path),
				});
			}
		}
		allScripts.sort((a, b) => a.name.localeCompare(b.name));
	}

	return allScripts;
};
