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

const input = {
	guArgs: [],
	tasks: [],
};

for (const arg of args) {
	if (arg.startsWith("-")) {
		if (input.tasks.length === 0) {
			input.guArgs.push(arg);
		} else {
			input.tasks.at(-1).args.push(arg);
		}
	} else {
		input.tasks.push({
			name: arg,
			args: [],
		});
	}
}

console.log(input);

for (const task of input.tasks) {
	try {
		const runningTask = spawnSync(
			path.resolve(TASK_DIR, task.name),
			task.args,
			{
				stdio: ["pipe", process.stdout, process.stderr],
			}
		);
	} catch (error) {
		console.log(error);
	}
}
// tasks.forEach((task, idx) => {
// 	const flagsForTask = flagsList[idx];
// 	const JS_SCRIPT = path.join(TASK_DIR, `${task}.js`)
// 	const SH_SCRIPT = path.join(TASK_DIR, `${task}.sh`);
// 	const EXECUTABLE = path.join(TASK_DIR, task);

// 	if (fs.existsSync(JS_SCRIPT)) {
// 		exec(`node "${JS_SCRIPT}" ${flagsForTask.join(" ")}`);
// 	} else if (fs.existsSync(SH_SCRIPT)) {
// 		exec(`bash "${SH_SCRIPT}" ${flagsForTask.join(" ")}`);
// 	} else if (fs.existsSync(EXECUTABLE) && !path.extname(task)) {
// 		exec(`"${EXECUTABLE}" ${flagsForTask.join(" ")}`);
// 	} else {
// 		error(`No task found with the name "${task}".`);
// 		listTasks();
// 		process.exit(1);
// 	}
// });
