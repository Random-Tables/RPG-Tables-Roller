import { STATUS } from '$lib/enums';
import { writable, get } from 'svelte/store';

const SEPERATOR = '-!-';

let projects: projList;
let currentProjData: projData;
let currentProjPath;
let projLoaded: STATUS = STATUS.UNSTARTED;
let folderIndexing: Array<folderKey>;

export const selectedProjFolderStore = writable("");
export const ProjectDataStore = writable(currentProjData);

function buildCurrentProjKeys() {
	const localFolderIndexing: Array<folderKey> = [];
	let defaultFolderSet = false;

	if (currentProjData.folders) {
		currentProjData.folders.forEach(function (folder, index) {
			if (!defaultFolderSet) {
				selectedProjFolderStore.set(index + '');
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
	setSelectedProjFolder: function (newFolder) {
		selectedProjFolderStore.set(newFolder);
	},
	getFolderIndexing: function () {
		return folderIndexing;
	},
	addRollToProject: function (choice: Choice, subChoice: number) {
		const keys = get(selectedProjFolderStore).split(SEPERATOR);
		const rootIndex = parseInt(keys[0], 10);

		let folderTarget = currentProjData.folders[rootIndex];

		if (keys.length === 2) {
			const subFolderIndex = parseInt(keys[1], 10);
			folderTarget = folderTarget.subfolders[subFolderIndex];
		}

		const choiceItem = Object.assign({}, choice);
		choiceItem.data = [choice.data[subChoice]];
		folderTarget.data.push(choiceItem);

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
	renameFolder: function (newName: string, folderIndex: number, subFolderIndex?: number): string {
		try {
			const rootFolder = currentProjData.folders[folderIndex];
			if (subFolderIndex || subFolderIndex === 0) {
				rootFolder.subfolders[subFolderIndex].name = newName;
			} else {
				rootFolder.name = newName;
			}
			ProjectDataStore.set(currentProjData);
			this.saveProject();
			buildCurrentProjKeys();
			return '';
		} catch (e) {
			return 'Unable to rename folder';
		}
	},
	deleteFolder: function (folderIndex: number, subFolderIndex?: number): string {
		try {
			const rootFolder = currentProjData.folders;
			if (subFolderIndex || subFolderIndex === 0) {
				rootFolder[folderIndex].subfolders.splice(subFolderIndex, 1);
			} else {
				rootFolder.splice(folderIndex, 1);
			}
			ProjectDataStore.set(currentProjData);
			this.saveProject();
			buildCurrentProjKeys();
			return '';
		} catch (e) {
			return 'Unable to rename folder';
		}
	},
	removeRoll: function (itemIndex, subItemIndex, folderKey) {
		const keys = folderKey.split(SEPERATOR);

		const keyA = parseInt(keys[0], 10);

		function clearChoice(choiceArray) {
			if (choiceArray[itemIndex].data.length === 1) {
				choiceArray = choiceArray.filter((item, i) => i !== itemIndex);
			} else {
				const newChoiceArray = choiceArray.slice();
				newChoiceArray[itemIndex].data.splice(subItemIndex, 1);
				choiceArray = newChoiceArray;
			}

			return choiceArray;
		}

		if (keys.length === 2) {
			const keyB = parseInt(keys[1], 10);
			const choiceRef = currentProjData.folders[keyA].subfolders[keyB].data as Choice[];
			currentProjData.folders[keyA].subfolders[keyB].data = clearChoice(choiceRef);
		} else if (keys.length === 1) {
			const choiceRef = currentProjData.folders[keyA].data as Choice[];
			currentProjData.folders[keyA].data = clearChoice(choiceRef);
		}

		ProjectDataStore.set(currentProjData);
		this.saveProject();
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
