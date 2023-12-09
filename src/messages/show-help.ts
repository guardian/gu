import { format, logger } from '../lib/logger.ts';

const help =
	`is a task-runner that wraps a layer of developer-convenience around running the scripts in your ${
		format.path('./scripts/')
	} directory.

Usage: ${format.cmd('gu <task> [<task> ...] [-- args...]')}

Example:
  ${format.cmd('gu test')}
  ${format.cmd('gu test lint')}

You can pass arguments to individual tasks:
  ${format.cmd('gu test \'lint --cache\'')}

You can also pass arguments to all tasks:
  ${format.cmd('gu test lint -- --cache')}

Tasks can be globs, e.g.:
  ${format.cmd('gu \'build-*\'')}
  ${format.cmd('gu \'**/test\'')}

You can also define dependencies between scripts in a ${
		format.path('gu.config.ts')
	} file.

See the README for more information.

Options:
  ${
		format.cmd('-l, --list')
	}    List all available tasks in the current directory
  ${format.cmd('-h, --help')}    Show this help message
  ${format.cmd('-v, --version')} Show the version number
`;

export const showHelp = () => logger.help(help);
