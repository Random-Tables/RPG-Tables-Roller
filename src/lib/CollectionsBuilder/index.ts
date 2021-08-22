import Files from '$lib/FileSys/index';
import { STATUS } from '$lib/enums';
import FileSys from '$lib/FileSys/index';

const stringReturnedValues = 3;
let status = STATUS.UNSTARTED;
// let dataMode = DATA_MODE.SLOW;
const callRegex = /\{{(.*?)\}}/g; // finds all text covered by {{example/roll:default}}
const masterIndex = {};
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
	const collections: FileEntry[] = await Files.getCollections();
	if (collections) {
		collections.forEach(async (element) => {
			const tableIndexData: tableIndex = await Files.getCollectionIndex(element.path);
			masterIndex[tableIndexData.collectionID] = tableIndexData;
			masterIndex[tableIndexData.collectionID].tablesData = {};
			Object.keys(tableIndexData.tables).forEach(function (key: string) {
				masterIndex[tableIndexData.collectionID].tablesData[key] = {
					dataReady: false,
					data: null,
					tablesList: tableIndexData.tables[key]
				};
			});
			status = STATUS.BUILT;
		});
	}
}
async function checkString(resultString: string): Promise<string> {
	const found = resultString.match(callRegex);
	if (found) {
		function getStringRandom(item) {
			return new Promise((res, rej) => {
				const collectionCall = item.substring(2, item.length - 2).split(':')[0]; // removes {{}} & backup option
				const tableAddress = collectionCall.split('/');
				getRoll(tableAddress[0], tableAddress[1], tableAddress[2], true).then((response) => {
					console.log('response', response);
					res(response);
				});
			});
		}

		const allCalls = Promise.all(found.map(getStringRandom));
		const stringReplacements = await allCalls;
		console.log('stringReplacements', stringReplacements);
		var iter = 0;
		function myReplace(a): string {
			const val = iter;
			iter++;
			return stringReplacements[val] + '';
		}

		var newString = resultString;
		return newString.replace(callRegex, myReplace);;
	} else {
		return resultString;
	}
}

function rollUtility(utility: tableUtilityItem): string {
	const choicesAvailable = utility.table.length;
	const randomTable = Math.floor(Math.random() * choicesAvailable);
	return utility.table[randomTable];
}
// const start = async () => {
// 	await asyncForEach([1, 2, 3], async (num) => {
// 	  await waitFor(50);
// 	  console.log(num);
// 	});
// 	console.log('Done');
//   }
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
							// tableSections.forEach(async (section) => {
							// 	tableParts.push(section.name);

							// 	const choicesAvailable = section.table.length;
							// 	const randomTable = Math.floor(Math.random() * choicesAvailable);
							// 	const checkedResult = await checkString(section.table[randomTable]);
							// 	tableParts.push(checkedResult);
							// });
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
	// const found: string[] = tableResult.match(callRegex);
	// use call name to replace, or use default
	//
}

async function getRoll(
	collection: string,
	group: string,
	table: string,
	requireUtility: boolean = false
): Promise<Choice | string> {
	return new Promise((resolve, reject) => {
		const rootCollection = masterIndex[collection];
		const isUtility = rootCollection.isUtility;
		if (requireUtility && !isUtility) {
			resolve(errorResponse);
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

					if (requireUtility) {
						resolve(utility);
					}
					resolve({
						data: [['Utility:', utility]],
						type: CHOICE_TYPE.string
					});
				} else {
					rollTable(tableData.data[table].tableSections, CHOICE_TYPE.string).then((rollData) => {
						resolve(rollData);
					});
				}
			};
			if (tableData.dataReady) {
				build();
			} else {
				console.log('tableData not ready');
				Files.getFile(rootCollection.path + '/' + group).then(function (tableJSON) {
					tableData.data = tableJSON;
					tableData.dataReady = true;

					build();
				});
			}
		} else {
			resolve(errorResponse);
		}
	});
}

export default {
	iniateBuild(): Promise<STATUS> {
		FileSys.setup();
		return new Promise((resolve, reject) => {
			if (status === STATUS.UNSTARTED) {
				status = STATUS.STARTED;
				buildIndexData().then(function () {
					resolve(status);
				});
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
	getMasterIndex(): object {
		return masterIndex;
	}
};
