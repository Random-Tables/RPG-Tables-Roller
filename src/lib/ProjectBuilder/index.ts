import FileSys from '$lib/FileSys/index';
import { STATUS } from '$lib/enums';

const seperator = "-!-";
let projects: projList;
let currentProjData;
let currentProjPath;
let projLoaded: STATUS;

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
					currentProjData = projJSON;
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
	SEPERATOR: seperator,
};
