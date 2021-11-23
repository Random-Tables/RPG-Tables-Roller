import FileSys from '$lib/FileSys/index';
import { STATUS } from '$lib/enums';

const SEPERATOR = '-!-';
let projects: projList;
let currentProjData: projData;
let currentProjPath;
let currentProjKeys;
let projLoaded: STATUS;
let selectedProjFolder;
let folderKeys: Array<folderKey>;

function buildCurrentProjKeys() {
	const keysList = {};
	const localFolderKeys: Array<folderKey> = [];
	let defaultFolderSet = false;

	if (currentProjData.folders) {
		currentProjData.folders.forEach(function (folder) {
			keysList[folder.name.replace(SEPERATOR, '/')] = {
				data: folder.data
			};
			if (!defaultFolderSet) {
				selectedProjFolder = folder.name;
				defaultFolderSet = true;
			}
			localFolderKeys.push({ text: folder.name, value: folder.name });

			if (folder.subfolders) {
				folder.subfolders.forEach(function (subfolder) {
					keysList[folder.name.replace(SEPERATOR, '/')].subfolderKeys = {
						[subfolder.name.replace(SEPERATOR, '/')]: subfolder.data
					};
					localFolderKeys.push({
						text: folder.name + '/' + subfolder.name,
						value: folder.name + SEPERATOR + subfolder.name
					});
				});
			}
		});
	}
	currentProjKeys = keysList;
	folderKeys = localFolderKeys;
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

			FileSys.getFile(currentProjPath)
				.then(function (projJSON) {
					currentProjData = (projJSON as unknown) as projData;
					buildCurrentProjKeys();
					projLoaded = STATUS.BUILT;
					resolve(currentProjData);
				})
				.catch(function (err) {
					projLoaded = STATUS.FAILED;
					reject();
				});
		});
	},
	getProjectStatus: function () {
		return projLoaded;
	},
	getProject: function () {
		return currentProjData;
	},
	getProjectKeys: function () {
		return currentProjKeys;
	},
	getSelectedProjFolder: function () {
		return selectedProjFolder;
	},
	setSelectedProjFolder: function (newFolder) {
		selectedProjFolder = newFolder;
	},
	getFolderKeys: function () {
		return folderKeys;
	},
	SEPERATOR: SEPERATOR
};
