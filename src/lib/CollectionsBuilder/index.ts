import Files from '$lib/FileSys/index';
import { STATUS } from '$lib/enums';
import FileSys from '$lib/FileSys/index';

const stringReturnedValues = 3;
let status = STATUS.UNSTARTED;
// let dataMode = DATA_MODE.SLOW;
const callRegex = /\{{(.*?)\}}/g; // finds all text covered by {{example/roll:default}}
const generalIndex = {
	categories: {
		all: {},
		utility: {}
	}
};
const errorResponse = {
	data: [['Error', 'Error building table']],
	type: 0
};
enum CHOICE_TYPE {
	string = 'string',
	npc = 'npc'
}
async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

async function buildIndexData() {
	return new Promise((resolve, reject) => {
		(async () => {
			try {
				const collections: FileEntry[] = await Files.getCollections();
				if (collections) {
					await collections.forEach(async (element, index) => {
						const tableIndexData: tableIndex = await Files.getCollectionIndex(element.path);
						// add to category
						const category = tableIndexData.category.toLowerCase();
						if (category !== 'utility') {
							generalIndex.categories.all[tableIndexData.collectionID] = tableIndexData;
						}
						if (!generalIndex.categories[category]) {
							generalIndex.categories[category] = {};
						}
						generalIndex.categories[category][tableIndexData.collectionID] = tableIndexData;
						generalIndex.categories[category][tableIndexData.collectionID].tablesData = {};
						Object.keys(tableIndexData.tables).forEach(function (key: string) {
							generalIndex.categories[category][tableIndexData.collectionID].tablesData[key] = {
								dataReady: false,
								data: null,
								tablesList: tableIndexData.tables[key]
							};
						});
					});
					status = STATUS.BUILT;
					resolve();
				} else {
					console.error('Unable to find files');
					reject();
				}
			} catch (err) {
				console.error('Unable to find files;', err);
				reject(err);
			}
		})();
	});
}
async function checkString(resultString: string): Promise<string> {
	const found = resultString.match(callRegex);
	if (found) {
		function getStringRandom(item) {
			return new Promise((res, rej) => {
				const collectionString = item.substring(2, item.length - 2).split(':');
				const collectionCall = collectionString[0]; // removes {{}} & backup option
				const tableAddress = collectionCall.split('/');

				getRoll(tableAddress[0], tableAddress[1], tableAddress[2], true).then((response) => {
					if(response === "") {
						res(collectionString[1]);
					} else {
						res(response);
					}
				});
			});
		}

		const allCalls = Promise.all(found.map(getStringRandom));
		const stringReplacements = await allCalls;
		var iter = 0;
		function myReplace(a): string {
			const val = iter;
			iter++;
			return stringReplacements[val] + '';
		}

		var newString = resultString;
		return newString.replace(callRegex, myReplace);
	} else {
		return resultString;
	}
}

function rollUtility(utility: tableUtilityItem): string {
	const choicesAvailable = utility.table.length;
	const randomTable = Math.floor(Math.random() * choicesAvailable);
	return utility.table[randomTable];
}
async function rollTable(
	tableSections: tableSection[],
	type: CHOICE_TYPE,
	resultsNum?: number
): Promise<Choice> {
	const returnNum = resultsNum || stringReturnedValues;
	return new Promise((resolve, reject) => {
		(async () => {
			try {
				switch (type) {
					case CHOICE_TYPE.string:
						const data = [];
						for (let i = 0; i < returnNum; i++) {
							const tableParts = [];
							await asyncForEach(tableSections, async (section) => {
								tableParts.push(section.name);

								const choicesAvailable = section.table.length;
								const randomTable = Math.floor(Math.random() * choicesAvailable);
								const checkedResult = await checkString(section.table[randomTable]);
								tableParts.push(checkedResult);
							});
							data.push(tableParts);
						}
						resolve({
							type,
							data
						});
						break;
					default:
						resolve({
							type: CHOICE_TYPE.string,
							data: [['Error', 'Unable to roll table']]
						});
				}
			} catch (err) {
				reject(err);
			}
		})();
	});
}

async function getRoll(
	collection: string,
	group: string,
	table: string,
	isUtility: boolean = false
): Promise<Choice | string> {
	return new Promise((resolve, reject) => {
		let rootCollection;
		if (isUtility) {
			rootCollection = generalIndex.categories.utility[collection];
		} else {
			rootCollection = generalIndex.categories.all[collection];
		}
		if (rootCollection) {
			const tableData: indexTableData = rootCollection.tablesData[group] || {
				data: null,
				dataReady: false,
				tableList: null
			};

			const build = () => {
				if (isUtility) {
					const utility = rollUtility(tableData.data[table]);
					resolve(utility);
				} else {
					rollTable(tableData.data[table].tableSections, CHOICE_TYPE.string).then((rollData) => {
						resolve(rollData);
					});
				}
			};
			if (tableData.dataReady) {
				build();
			} else {
				Files.getFile(rootCollection.path + '/' + group).then(function (tableJSON) {
					tableData.data = tableJSON;
					tableData.dataReady = true;

					build();
				});
			}
		} else {
			if(isUtility) {
				resolve("");
			} else {
				resolve(errorResponse);
			}
		}
	});
}

export default {
	iniateBuild(): Promise<STATUS> {
		FileSys.setup();
		return new Promise((resolve, reject) => {
			if (status === STATUS.UNSTARTED) {
				status = STATUS.STARTED;

				(async () => {
					await FileSys.initRootDir();
					await FileSys.initRootFiles();
					buildIndexData().then(function () {
						resolve(status);
					});
				})();
			} else {
				resolve(status);
			}
		});
	},
	rollTable,
	rollUtility,
	getRoll,
	getStatus(): STATUS {
		return status;
	},
	getMGeneralIndex(): object {
		return generalIndex;
	}
};
