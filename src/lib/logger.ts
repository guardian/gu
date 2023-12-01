import {
	bgWhite,
	black,
	blue,
	bold,
	dim,
	green,
	red,
	underline,
	yellow,
} from 'https://deno.land/std@0.205.0/fmt/colors.ts';

const prefix = '→';

type LogOptions = {
	prompt?: string;
	aside?: string;
};

export const logger = {
	alert(message: string, { prompt, aside }: LogOptions = {}): void {
		let logMessage = message.trim();
		if (aside) {
			logMessage += ' ' + dim(aside);
		}
		if (prompt) {
			logMessage += '\n' + dim(prompt);
		}
		console.log(yellow(prefix + ' ' + logMessage));
	},
	error(message: string, { prompt, aside }: LogOptions = {}): void {
		let logMessage = message.trim();
		if (aside) {
			logMessage += ' ' + dim(aside);
		}
		if (prompt) {
			logMessage += '\n' + dim(prompt);
		}
		console.log(red(prefix + ' ' + logMessage));
	},
	help(message: string): void {
		const logMessage = message.trim();
		console.log(bgWhite(black(' gu ')) + ' ' + logMessage);
	},
	info(message: string, { prompt, aside }: LogOptions = {}): void {
		let logMessage = message.trim();
		if (aside) {
			logMessage += ' ' + dim(aside);
		}
		if (prompt) {
			logMessage += '\n' + dim(prompt);
		}
		console.log(blue(prefix + ' ' + logMessage));
	},
	success(message: string, { prompt, aside }: LogOptions = {}): void {
		let logMessage = message.trim();
		if (aside) {
			logMessage += ' ' + dim(aside);
		}
		if (prompt) {
			logMessage += '\n' + dim(prompt);
		}
		console.log(green(prefix + ' ' + logMessage));
	},
	log(message: string, { aside }: LogOptions = {}): void {
		let logMessage = message.trim();
		if (aside) {
			logMessage += ' ' + dim(aside);
		}
		console.log(prefix + ' ' + logMessage);
	},
	quiet(message: string, { aside }: LogOptions = {}): void {
		let logMessage = message.trim();
		if (aside) {
			logMessage += ' ' + `(${aside})`;
		}
		console.log(dim(logMessage));
	},
};

export const format = {
	cmd: (cmd: string) => blue(cmd),
	name: (name: string) => bold(name),
	path: (path: string) => underline(path),
	rule: (message = '') => {
		const char = '·';
		const width = Deno.consoleSize().columns;

		let rule = char.repeat(width);

		if (width <= message.length) {
			rule = blue(message);
		}

		if (message.length > 0) {
			message = ' ' + message + ' ';

			rule = message.padStart((width / 2) + (message.length / 2), char);

			rule = rule.padEnd(width, char);
		}

		return blue(rule);
	},
};
