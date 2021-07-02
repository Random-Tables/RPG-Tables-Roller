import Files from '$lib/FileSys/index';
import { STATUS, DATA_MODE } from '$lib/enums';

let status = STATUS.UNSTARTED;
let dataMode = DATA_MODE.SLOW;
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
		return new Promise((resolve, reject) => {
			const rootCollection = masterIndex[collection];
			if (rootCollection) {
				console.log('rootCollection', rootCollection);
				const tableData: indexTableData = rootCollection.tablesData[group];

				if (tableData.dataReady) {
					console.log('tableData dataReady');
					resolve(tableData.data[table].tableSections[0].label);
				} else {
					Files.getFile(rootCollection.path + '/' + group).then(function (tableJSON) {
						console.log('tableJSON', tableJSON);
						tableData.data = tableJSON;
						resolve(tableData.data[table].tableSections[0].label);
					});
				}
			} else {
				resolve(errorResponse);
			}
		});
	}
};
