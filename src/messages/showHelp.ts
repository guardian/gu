import { format, logger } from '../lib/logger.ts';

const help = `is a task-runner that runs any scripts in ${
	format.path('./scripts/')
} with extra convenience.

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

Gu will also run any relevant ${format.cmd('before-*')}/${
	format.cmd('after-*')
} tasks it finds in ${format.path('./scripts/.gu/')}.

For example, if you run ${
	format.cmd('gu test')
}, it will try to run the following:
  ${format.path('./scripts/.gu/before-all')}
  ${format.path('./scripts/.gu/before-test')}
  ${format.path('./scripts/test')}
  ${format.path('./scripts/.gu/after-test')}
  ${format.path('./scripts/.gu/after-all')}

You can use this feature to set up your environment before running a task, or to clean up afterwards.

Options:
  ${
	format.cmd('-l, --list')
}    List all available tasks in the current directory
  ${format.cmd('-h, --help')}    Show this help message
  ${format.cmd('-v, --version')} Show the version number
  ${
	format.cmd('--verify-node')
} Ensure the correct version of Node is being used
`;

export const showHelp = () => logger.help(help);
