import { SCRIPTS_DIR_NAME } from '../lib/paths.ts';
import { format, logger } from '../lib/logger.ts';

const intro = `${
	format.name('gu')
} is a task runner that adds a layer of developer-convenience to executing files in the ./${SCRIPTS_DIR_NAME} directory.
To use ${
	format.name('gu')
} with this project, add something to ./${SCRIPTS_DIR_NAME} and make it executable.
You can then run it with ${format.cmd('gu <task>')}.
For example, if you have a file named ./${SCRIPTS_DIR_NAME}/hello.sh, you can run it with ${
	format.cmd('gu hello')
}.
Run '${(format.cmd('gu --help'))}' for more information.`;

export const showIntro = () => logger.info(intro);
