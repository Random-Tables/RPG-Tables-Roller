import { STATUS } from '$lib/enums';
import FileSys from '$lib/FileSys/index';
import { writable } from 'svelte/store';

let debug = process.env.NODE_ENV === 'development';

export const ErrorArray = writable([]);

export const LoadedArray = writable([]);

const Splitters = {
	number: "Number#",
	uppercase: "#UP",
}

let status = STATUS.UNSTARTED;
let projects: projList;

const callRegex = /\{{(.*?)\}}/g; // finds all text covered by {{example/roll:default}}

const generalIndex = {
	categories: {
		all: {},
		utility: {}
	}
};

const errorResponse = {
	data: [
		[
			{
				title: 'Error',
				data: 'Error building table',
				class: 'text-red-error'
			}
		]
	],
	call: { collection: '', tablesGroupKey: '', tableName: '' },
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

async function buildIndexData(): Promise<void> {
	return new Promise((resolve, reject) => {
		(async () => {
			try {
				const collections: FileEntry[] = await FileSys.getCollections();

				if (collections) {
					// Local arrays for testing required collections
					const CollectionIds = [];
					const CollectionNames = [];
					const CollectionVersions = [];
					const requiredCheckArray = [];

					await asyncForEach(collections, async (element, index) => {
						const tableIndexData: tableIndex = await FileSys.getCollectionIndex(element.path);

						if (tableIndexData.collectionName !== 'error') {
							// Build data to check required collections
							CollectionIds.push(tableIndexData.collectionID);
							CollectionNames.push(tableIndexData.collectionName);
							CollectionVersions.push(tableIndexData.version || 0);
							requiredCheckArray.push(tableIndexData.required || []);

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
						} else {
							ErrorArray.update((val) => {
								const arr = val.slice();
								arr.push("Collection '" + element.name + "' is missing an index file");
								return arr;
							});
						}
					});

					// Check required items
					if (CollectionIds.length === requiredCheckArray.length) {
						requiredCheckArray.forEach((reqArray, collectionIndex) => {
							reqArray.forEach((required) => {
								// Add error if required collection missing from collections
								let collectionReq = required;
								let version = null;
								if (required.includes('@')) {
									[collectionReq, version] = required.split('@');
								}

								const requiredCollectionIndex = CollectionIds.indexOf(collectionReq);

								if (requiredCollectionIndex === -1) {
									const errorString =
										CollectionNames[collectionIndex] + ' is missing collection: ' + collectionReq;

									ErrorArray.update((val) => {
										const arr = val.slice();
										arr.push(errorString);
										return arr;
									});

									// Checks if local collection version higher than required
								} else if (parseInt(version) > CollectionVersions[requiredCollectionIndex]) {
									const errorString = `'${CollectionNames[collectionIndex]}' requires collection '${CollectionNames[requiredCollectionIndex]}' to be version ${version} or higher`;

									ErrorArray.update((val) => {
										const arr = val.slice();
										arr.push(errorString);
										return arr;
									});
								}
							});
						});
					}
					LoadedArray.set(CollectionNames);

					if (debug) console.log('generalIndex', generalIndex);

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

async function stringCaller(collectionCall, defaultVal) {
	const tableAddress = collectionCall.split('/');

	try {
		if (debug) console.log('checkString--tableAddress', tableAddress);

		return await getRoll(tableAddress[0], tableAddress[1], tableAddress[2], true, defaultVal).then(
			(response) => {
				if (debug) console.log('checkString--getRoll-response', response);

				if (response.utility === '') {
					return defaultVal;
				} else {
					return response.utility;
				}
			}
		);
	} catch (e) {
		return defaultVal;
	}
	
}

async function checkString(resultString: string): Promise<string> {
	const externalCallFound = resultString.match(callRegex);

	if (debug) console.log('checkString--externalCallFound', externalCallFound);

	if (externalCallFound) {
		function getStringRandom(item) {
			return new Promise((res, rej) => {
				const callString = item.substring(2, item.length - 2).split(':'); // removes {{}} wrapper from call

				// Checks type of callString; subcollection, uppercase or integer range
				if (callString[0].includes(Splitters.uppercase)) {
					const collectionCall = callString[0].split("#")[0];
					stringCaller(collectionCall, callString[1]).then((str) => {
						res(str.charAt(0).toUpperCase() + str.slice(1));
					});

				}else if (callString[0].includes(Splitters.number)) {
					const valueRange = callString[0].split('#')[1].split('-');

					const lowValue = parseInt(valueRange[0]);
					const highValue = parseInt(valueRange[1]);

					if ((lowValue || lowValue === 0) && (highValue || highValue === 0)) {
						res('' + (Math.floor(Math.random() * (highValue - lowValue)) + lowValue));
					}
					res(callString[1]);
				} else {
					const collectionCall = callString[0];
					res(stringCaller(collectionCall, callString[1]));
				}
			});
		}

		const allCalls = Promise.all(externalCallFound.map(getStringRandom));
		const stringReplacements = await allCalls;
		var iter = 0;
		function myReplace(): string {
			const val = iter;
			iter++;
			return stringReplacements[val] + '';
		}
		if (debug) console.log('stringReplacements', stringReplacements);

		var newString = resultString;
		return newString.replace(callRegex, myReplace);
	} else {
		return resultString;
	}
}

function rollUtility(utility: tableUtilityItem): Promise<string> {
	return new Promise((resolve, reject) => {
		(async () => {
			const choicesAvailable = utility.table.length;
			const randomTable = Math.floor(Math.random() * choicesAvailable);
			const checkedResult = await checkString(utility.table[randomTable]);
			resolve(checkedResult);
		})();
	});
}
async function rollTable(
	tableSections: tableSection[],
	type: CHOICE_TYPE,
	call: ChoiceCall
): Promise<Choice> {
	return new Promise((resolve, reject) => {
		(async () => {
			try {
				switch (type) {
					case CHOICE_TYPE.string:
						const result: ChoiceData[] = [];

						await asyncForEach(tableSections, async (section) => {
							const choicesAvailable = section.table.length;

							const randomTable = Math.floor(Math.random() * choicesAvailable);

							const checkedResult = await checkString(section.table[randomTable]);

							result.push({
								title: section.name,
								data: checkedResult,
								class: section.class,
								icon: section.icon,
								iconclass: section.iconclass
							});
						});

						resolve({
							type,
							call,
							data: [result]
						});
						break;
					default:
						resolve({
							type: CHOICE_TYPE.string,
							call: errorResponse.call,
							data: [
								[
									{
										title: 'Error',
										data: 'Unable to roll table',
										class: 'text-red-error'
									}
								]
							]
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
	isUtility: boolean = false,
	backupValue?: string
): Promise<Choice> {
	if (debug) console.log('getRoll--isUtility', isUtility);

	const call = {
		collection,
		tablesGroupKey: group,
		tableName: table
	};

	if (debug) console.log('getRoll--call', call);

	return new Promise((resolve, reject) => {
		let rootCollection;
		if (isUtility) {
			rootCollection = generalIndex.categories.utility[collection];
		} else {
			rootCollection = generalIndex.categories.all[collection];
		}
		if (debug) console.log('getRoll--rootCollection', rootCollection);
		if (rootCollection) {
			const tableData: indexTableData = rootCollection.tablesData[group] || {
				data: null,
				dataReady: false,
				tableList: null
			};
			if (debug) console.log('getRoll--tableData', tableData);

			const build = () => {
				if (isUtility) {
					const utilityTable = tableData.data[table];

					if (utilityTable) {
						rollUtility(utilityTable)
							.then((rollResult) => {
								if (debug) console.log('rollUtility-res', rollResult);
								resolve({
									utility: rollResult,
									data: [
										[
											{
												title: '',
												data: rollResult
											}
										]
									],
									type: CHOICE_TYPE.string,
									call
								});
							})
							.catch((err) => console.error(err));
					} else {
						resolve({
							utility: backupValue,
							data: [
								[
									{
										title: '',
										data: backupValue
									}
								]
							],
							type: CHOICE_TYPE.string,
							call
						});
					}
				} else {
					rollTable(tableData.data[table].tableSections, CHOICE_TYPE.string, call).then(
						(rollData) => {
							if (debug) console.log('rollData', rollData);
							resolve(rollData);
						}
					);
				}
			};
			if (tableData.dataReady) {
				build();
			} else {
				FileSys.getFile(rootCollection.path + '/' + group).then(function (tableJSON) {
					tableData.data = tableJSON;
					tableData.dataReady = true;

					build();
				});
			}
		} else {
			if (debug) console.log('getRoll--root collection not found');
			if (isUtility) {
				resolve({
					utility: '',
					type: CHOICE_TYPE.string,
					call
				});
			} else {
				resolve(errorResponse);
			}
		}
	});
}
async function getRollWithCall(call: ChoiceCall, isUtility: boolean) {
	return getRoll(call.collection, call.tablesGroupKey, call.tableName, isUtility);
}

async function iniateBuild(): Promise<STATUS> {
	await FileSys.setup();
	return new Promise((resolve, reject) => {
		if (status === STATUS.UNSTARTED) {
			status = STATUS.STARTED;

			(async () => {
				await FileSys.initRootDir();
				await FileSys.initRootFiles();
				projects = await FileSys.getProjectsData();
				buildIndexData().then(function () {
					resolve(status);
				});
			})();
		} else {
			resolve(status);
		}
	});
}
async function getProjectsFromDisk(): Promise<projList> {
	return new Promise((resolve, reject) => {
		status = STATUS.STARTED;
		(async () => {
			projects = await FileSys.getProjectsData();
			status = STATUS.BUILT;
			resolve(projects);
		})();
	});
}

// EXPORT FUNCTIONS

export default {
	iniateBuild,
	rollTable,
	rollUtility,
	getRoll,
	getRollWithCall,
	getStatus(): STATUS {
		return status;
	},
	getMGeneralIndex(): object {
		return generalIndex;
	},
	getProjects(): projList {
		return projects;
	},
	getProjectsFromDisk
};
