const fs = window.__TAURI__.fs;

export default {
	getCollections: async (): Promise<FileEntry[]> => {
		return new Promise((resolve, reject) => {
			fs.readDir('Fantasy-Tables/Collections', {
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
			fs.readTextFile(collectionPath + '/index.json').then(
				function (result) {
					const indexAsObject = JSON.parse(result);
					resolve(indexAsObject);
				},
				function () {
					reject({ collectionID: null, collectionName: 'error' });
				}
			);
		});
	}
};
