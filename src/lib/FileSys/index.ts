import stringData from './defaultData';

var fs = undefined;
if (window !== undefined) {
	fs = window.__TAURI__.fs;
}
const rootFolder = 'Fantasy-Tables';
const collectionsFolder = 'Collections';
const readmePath = '/README.txt';
const castlesIndex = '/Collections/castles';

export default {
	setup: (): void => {
		fs = window.__TAURI__.fs;
	},
	initRootFiles: async (): Promise<void> => {
		return new Promise((resolve, reject) => {
			(async () => {
				const fileChecks = Promise.all([
					fs
						.readTextFile(rootFolder + readmePath, {
							dir: window.__TAURI__.fs.BaseDirectory['Document']
						})
						.then(
							function (result) {
								return true;
							},
							function () {
								return false;
							}
						),
					fs
						.readDir(rootFolder + '/' + collectionsFolder, {
							dir: window.__TAURI__.fs.BaseDirectory['Document']
						})
						.then(
							function (result) {
								return true;
							},
							function () {
								return false;
							}
						)
				]);
				const fileCheckResults = await fileChecks;
				// Check missing readme & collections folder and add if not yet created
				const addfiles = Promise.all([
					fileCheckResults[0] ||
						fs
							.writeFile(
								{
									path: rootFolder + readmePath,
									contents: stringData.Readme
								},
								{
									dir: window.__TAURI__.fs.BaseDirectory['Document']
								}
							)
							.then(
								function (result) {
									return true;
								},
								function (err) {
									return false;
								}
							),
					fileCheckResults[1] === false &&
						fs
							.createDir(rootFolder + '/' + collectionsFolder, {
								dir: window.__TAURI__.fs.BaseDirectory['Document']
							})
							.then(
								function (result) {
									return true;
								},
								function () {
									return false;
								}
							)
				]);
				await addfiles;
				if (fileCheckResults[1] === false) {
					// If no collections folder add in some example data
					await fs.createDir(rootFolder + castlesIndex, {
						dir: window.__TAURI__.fs.BaseDirectory['Document']
					});
					await fs.writeFile(
						{
							path: rootFolder + castlesIndex + '/index.json',
							contents: stringData.castlesIndex
						},
						{
							dir: window.__TAURI__.fs.BaseDirectory['Document']
						}
					);
					await fs.writeFile(
						{
							path: rootFolder + castlesIndex + '/castle.json',
							contents: stringData.castlesMain
						},
						{
							dir: window.__TAURI__.fs.BaseDirectory['Document']
						}
					);

					await fs.writeFile(
						{
							path: rootFolder + castlesIndex + '/castle-japan.json',
							contents: stringData.castlesJapan
						},
						{
							dir: window.__TAURI__.fs.BaseDirectory['Document']
						}
					);
				}
				resolve();
			})();
		});
	},
	initRootDir: async (): Promise<void> => {
		return new Promise((resolve, reject) => {
			fs.readDir(rootFolder, {
				dir: window.__TAURI__.fs.BaseDirectory['Document']
			}).then(
				function (result) {
					resolve();
				},
				function (err) {
					fs.createDir(rootFolder, {
						dir: window.__TAURI__.fs.BaseDirectory['Document']
					});
					reject();
				}
			);
		});
	},
	getCollections: async (): Promise<FileEntry[]> => {
		return new Promise((resolve, reject) => {
			fs.readDir(rootFolder + '/' + collectionsFolder, {
				dir: window.__TAURI__.fs.BaseDirectory['Document']
			}).then(
				function (result) {
					resolve(result);
				},
				function () {
					reject([]);
				}
			);
		});
	},
	getCollectionIndex: async (collectionPath: string): Promise<tableIndex> => {
		return new Promise((resolve, reject) => {
			fs.readTextFile(collectionPath + '/index.json')
				.then(
					function (result) {
						const indexAsObject = JSON.parse(result);
						indexAsObject.path = collectionPath;
						resolve(indexAsObject);
					},
					function (error) {
						console.error(error);
						reject({ collectionID: null, collectionName: 'error' });
					}
				)
				.catch((err) => {
					console.error('ERR', err);
				});
		});
	},
	getFile: async (tablePath: string): Promise<tableItem> => {
		return new Promise((resolve, reject) => {
			fs.readTextFile(tablePath + '.json').then(
				function (result) {
					const tableObject = JSON.parse(result);
					resolve(tableObject);
				},
				function (error) {
					console.error(error);
					reject({ collectionID: null, collectionName: 'error' });
				}
			);
		});
	}
};
