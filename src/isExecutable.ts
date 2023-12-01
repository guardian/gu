export const isExecutable = async (filePath: string) => {
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
