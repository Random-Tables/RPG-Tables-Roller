import Files from '$lib/FileSys/index';
import { STATUS } from '$lib/enums';
import FileSys from '$lib/FileSys/index';

let status = STATUS.UNSTARTED;
// let dataMode = DATA_MODE.SLOW;
const callRegex = /\{{([^|]+)\}}/g; // finds all text covered by {{example/roll:default}}
const masterIndex = {};
const errorResponse = ['Error: table not found', '', ''];

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

async function rollTable(tableResult: string) {
	const found: string[] = tableResult.match(callRegex);
	// use call name to replace, or use default
	//
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
	getStatus(): STATUS {
		return status;
	},
	getMasterIndex(): object {
		return masterIndex;
	},
	async getRoll(collection: string, group: string, table: string): Promise<string[]> {
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
					resolve(tableData.data[table].tableSections);
				} else {
					console.log('tableData not ready');
					Files.getFile(rootCollection.path + '/' + group).then(function (tableJSON) {
						tableData.data = tableJSON;
						tableData.dataReady = true;

						resolve(tableData.data[table].tableSections);
					});
				}
			} else {
				resolve(errorResponse);
			}
		});
	}
};
