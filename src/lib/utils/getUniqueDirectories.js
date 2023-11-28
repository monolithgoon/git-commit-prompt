// function getUniquePaths(filesArray) {
// 	const directories = new Set();

// 	filesArray.forEach((filePath) => {
// 		const parts = filePath.split('/');
// 		let currentDir = '';

// 		parts.forEach((part) => {
// 			currentDir += part + '/';
// 			directories.add(currentDir.slice(0, -1)); // Remove trailing slash
// 		});
// 	});

// 	return Array.from(directories);
// }

function getUniquePaths(filesArray) {
	const directories = new Set();

	filesArray.forEach((filePath) => {
		const parts = filePath.split("/");
		let currentDir = "";

		parts.forEach((part, index) => {
			if (index === parts.length - 1 && part.includes(".")) {
				// If it's the last part and contains a dot (file with extension), add without a trailing slash
				currentDir += part;
			} else {
				currentDir += part + "/";
			}
			directories.add(currentDir);
		});
	});

	return Array.from(directories).map((item, index) => {
		return {
			key: (index + 1).toString(),
			value: item,
		};
	});
}

exports.getUniquePaths = getUniquePaths;
