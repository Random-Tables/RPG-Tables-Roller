import { STATUS } from '$lib/enums';
import { writable } from 'svelte/store';

const SEPERATOR = '-!-';

let projects: projList;
let currentProjData: projData;
let currentProjPath;
let projLoaded: STATUS;
let folderIndexing: Array<folderKey>;
let selectedProjFolderindex;

export const ProjectDataStore = writable(currentProjData);

function buildCurrentProjKeys() {
	const localFolderIndexing: Array<folderKey> = [];
	let defaultFolderSet = false;

	if (currentProjData.folders) {
		currentProjData.folders.forEach(function (folder, index) {
			if (!defaultFolderSet) {
				selectedProjFolderindex = index + '';
				defaultFolderSet = true;
			}
			localFolderIndexing.push({ text: folder.name, value: index + '' });

			if (folder.subfolders) {
				folder.subfolders.forEach(function (subfolder, subIndex) {
					localFolderIndexing.push({
						text: folder.name + '/' + subfolder.name,
						value: index + SEPERATOR + subIndex
					});
				});
			}
		});
	}
	folderIndexing = localFolderIndexing;
}

function newFolder(name, isRoot?): projFolder {
	const newFolder: projFolder = {
		name,
		data: []
	};
	if (isRoot) newFolder.subfolders = [];
	return newFolder;
}

export default {
	setProjList: function (newList: projList) {
		projects = newList;
	},
	getProjList: function () {
		return projects;
	},
	buildProject: async function (path): Promise<Object> {
		return new Promise((resolve, reject) => {
			projLoaded = STATUS.STARTED;
			currentProjPath = path;

			(async () => {
				const FileSys = await import(`../FileSys/index.js`);

				FileSys.default
					.getFile(currentProjPath)
					.then(function (projJSON) {
						currentProjData = (projJSON as unknown) as projData;
						ProjectDataStore.set(currentProjData);
						buildCurrentProjKeys();
						projLoaded = STATUS.BUILT;
						resolve(currentProjData);
					})
					.catch(function (err) {
						projLoaded = STATUS.FAILED;
						reject();
					});
			})();
		});
	},
	getProjectStatus: function () {
		return projLoaded;
	},
	getProject: function () {
		return currentProjData;
	},
	getSelectedProjFolderIndex: function () {
		return selectedProjFolderindex;
	},
	setSelectedProjFolder: function (newFolder) {
		selectedProjFolderindex = newFolder;
	},
	getFolderIndexing: function () {
		return folderIndexing;
	},
	addRollToProject: function (Choice) {
		const keys = selectedProjFolderindex.split(SEPERATOR);
		const rootIndex = parseInt(keys[0], 10);

		let folderTarget = currentProjData.folders[rootIndex];

		if (keys.length === 2) {
			const subFolderIndex = parseInt(keys[2], 10);
			folderTarget = folderTarget.subfolders[subFolderIndex];
		}
		folderTarget.data.push(Choice);

		ProjectDataStore.set(currentProjData);
		this.saveProject();
	},
	addFolderToProject: function (folderName: string, parentIndex?: number): boolean {
		if (parentIndex || parentIndex === 0) {
			const currentSubFolders = currentProjData.folders[parentIndex].subfolders.map((f) => {
				return f.name;
			});
			currentProjData.folders[parentIndex].subfolders.push(newFolder(folderName));
		} else {
			const currentFolders = currentProjData.folders.map((f) => {
				return f.name;
			});
			if (!currentFolders.includes(folderName)) {
				currentProjData.folders.push(newFolder(folderName, true));
			} else {
				return false;
			}
		}

		ProjectDataStore.set(currentProjData);
		this.saveProject();
		buildCurrentProjKeys();
		return true;
	},
	createProject: function (name): Promise<Boolean> {
		const projectJSON = JSON.stringify({
			name,
			lastEdit: '12/12/2020 19:45',
			folders: []
		});
		return new Promise((resolve, reject) => {
			(async () => {
				const FileSys = await import(`../FileSys/index.js`);
				const projects = await FileSys.default.getProjectsData();
				const filenameExists = projects.some((proj) => {
					return proj.name === name;
				});
				if (!filenameExists) {
					FileSys.default
						.saveProjectFile(name, projectJSON)
						.then(function () {
							resolve(true);
						})
						.catch(function (err) {
							reject(false);
						});
				} else {
					reject('Filename already exists');
				}
			})();
		});
	},
	saveProject: function (): Promise<Boolean> {
		return new Promise((resolve, reject) => {
			(async () => {
				const FileSys = await import(`../FileSys/index.js`);
				const projectJSON = JSON.stringify(currentProjData);
				FileSys.default.saveProjectFile(currentProjPath, projectJSON, true);
			})();
		});
	},
	SEPERATOR: SEPERATOR
};
