#!/usr/bin/env node

import { access, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function echoWithColor(color, message) {
	console.log(color + message + "\x1b[0m");
}

function log(message) {
	echoWithColor("\x1b[2m", message);
}

function error(message) {
	echoWithColor("\x1b[31m", message);
}

const TASK_DIR_NAME = "scripts";
const TASK_DIR = path.join(process.cwd(), TASK_DIR_NAME);

if (!existsSync(TASK_DIR)) {
	error(`Tasks must live in ./${TASK_DIR_NAME}, but it does not exist.`);
	process.exit(1);
}

const isExecutable = async (filePath) => {
	try {
		const stats = await stat(filePath);
		const isFile = stats.isFile();
		const ownerExecutable = (stats.mode & 0o100) > 0;
		const groupExecutable = (stats.mode & 0o010) > 0;
		const othersExecutable = (stats.mode & 0o001) > 0;

		return isFile && (ownerExecutable || groupExecutable || othersExecutable);
	} catch (error) {
		return false;
	}
};

const listTasks = async () => {
	log("Available tasks:");
	const taskDirFiles = await readdir(TASK_DIR);

	for (const file of taskDirFiles) {
		const taskPath = path.resolve(TASK_DIR, file);
		if (await isExecutable(taskPath)) {
			const task = path.basename(file, path.extname(file));
			log(`- ${task}`);
		}
	}
};

const args = process.argv.slice(2);

if (args.length === 0) {
	await listTasks();
	process.exit(0);
}

// parse args into tasks and guArgs
const flags = [];
const tasks = [];

for (const arg of args) {
	if (arg.startsWith("-")) {
		if (tasks.length === 0) {
			flags.push(arg);
		} else {
			tasks.at(-1).args.push(arg);
		}
	} else {
		tasks.push({
			name: arg,
			args: [],
		});
	}
}

// run any local 'before' checks
spawnSync(path.resolve(TASK_DIR, ".gu", "before"), flags, {
	stdio: ["pipe", process.stdout, process.stderr],
});

// run each task synchronously
for (const task of tasks) {
	try {
		spawnSync(path.resolve(TASK_DIR, task.name), task.args, {
			stdio: ["pipe", process.stdout, process.stderr],
		});
	} catch (error) {
		console.log(error);
	}
}
