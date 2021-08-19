import Files from '$lib/FileSys/index';
import { STATUS } from '$lib/enums';
import FileSys from '$lib/FileSys/index';

const stringReturnedValues = 3;
let status = STATUS.UNSTARTED;
// let dataMode = DATA_MODE.SLOW;
const callRegex = /\{{([^|]+)\}}/g; // finds all text covered by {{example/roll:default}}
const masterIndex = {};
const errorResponse = {
	data: [["Error", 'Error building table']],
	type: 0
};
enum CHOICE_TYPE {
	string = 'string',
	npc = 'npc'
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

async function rollTable(
	tableSections: tableSection[],
	type: CHOICE_TYPE,
	resultsNum?: number
): Promise<Choice> {
	const returnNum = resultsNum || stringReturnedValues;
	return new Promise((resolve, reject) => {
		switch (type) {
			case CHOICE_TYPE.string:
				const data = [];
				for (let i = 0; i < returnNum; i++) {
					const tableParts = [];
					tableSections.forEach((section) => {
						tableParts.push(section.name);

						const choicesAvailable = section.table.length;
						const randomTable = Math.floor(Math.random() * choicesAvailable);
						tableParts.push(section.table[randomTable]);
					});
					data.push(tableParts);
					console.log('data', data);
				}
				resolve({
					type,
					data
				});
				break;
			default:
				resolve({
					type: CHOICE_TYPE.string,
					data: [["Error", 'Unable to roll table']]
				});
		}
	});
	// const found: string[] = tableResult.match(callRegex);
	// use call name to replace, or use default
	//
}

async function getRoll(collection: string, group: string, table: string): Promise<Choice> {
	console.log('input', {
		collection,
		group,
		table
	});
	return new Promise((resolve, reject) => {
		const rootCollection = masterIndex[collection];
		if (rootCollection) {
			const tableData: indexTableData = rootCollection.tablesData[group] || {
				data: null,
				dataReady: false,
				tableList: null
			};

			if (tableData.dataReady) {
				rollTable(tableData.data[table].tableSections, CHOICE_TYPE.string).then((rollData) => {
					resolve(rollData);
				});
			} else {
				console.log('tableData not ready');
				Files.getFile(rootCollection.path + '/' + group).then(function (tableJSON) {
					tableData.data = tableJSON;
					tableData.dataReady = true;

					rollTable(tableData.data[table].tableSections, CHOICE_TYPE.string).then((rollData) => {
						resolve(rollData);
					});
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
	getRoll,
	getStatus(): STATUS {
		return status;
	},
	getMasterIndex(): object {
		return masterIndex;
	}
};
