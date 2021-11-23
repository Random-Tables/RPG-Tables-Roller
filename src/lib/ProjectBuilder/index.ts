import FileSys from '$lib/FileSys/index';
import { STATUS } from '$lib/enums';

const seperator = '-!-';
let projects: projList;
let currentProjData: projData;
let currentProjPath;
let currentProjKeys;
let projLoaded: STATUS;

function buildCurrentProjKeys() {
	const keysList = {};
	if (currentProjData.folders) {
		currentProjData.folders.forEach(function (folder) {
			keysList[folder.name] = {
				data: folder.data
			};

			if (folder.subfolders) {
				folder.subfolders.forEach(function (subfolder) {
					keysList[folder.name].subfolderKeys = {
						[subfolder.name]: subfolder.data
					};
				});
			}
		});
	}
	currentProjKeys = keysList;
}

export default {
	setProjist: function (newList: projList) {
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
	SEPERATOR: seperator
};
