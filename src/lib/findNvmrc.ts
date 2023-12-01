export const findNvmrc = async (startDir: string = Deno.cwd()) => {
	let currentDir = startDir;

	while (true) {
		const entries = Deno.readDir(currentDir);

		for await (const entry of entries) {
			if (entry.name === '.nvmrc' && entry.isFile) {
				return `${currentDir}/.nvmrc`;
			}
		}

		const parentDir = Deno.realPathSync(`${currentDir}/..`);

		if (parentDir === currentDir) {
			// Reached the root directory without finding .nvmrc
			return undefined;
		}

		currentDir = parentDir;
	}
};

// console.log(await findNvmrc());
