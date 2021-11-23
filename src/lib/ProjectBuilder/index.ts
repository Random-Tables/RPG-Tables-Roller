// import FileSys from '$lib/FileSys/index';
import { STATUS } from '$lib/enums';
import { writable, readable } from 'svelte/store';

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
				const FileSys = await import("$lib/FileSys/index.ts");
	
				FileSys.default.getFile(currentProjPath)
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

		// let folderTarget = currentProjKeys[keys[0]];
		let folderTarget = currentProjData.folders[rootIndex];

		if (keys.length === 2) {
			const subFolderIndex = parseInt(keys[2], 10);
			folderTarget = folderTarget.subfolders[subFolderIndex];
		}
		folderTarget.data.push(Choice);
		ProjectDataStore.set(currentProjData);
	},
	SEPERATOR: SEPERATOR
};
