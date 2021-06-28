import Files from '$lib/FileSys/index';
import { STATUS, DATA_MODE } from '$lib/enums';

let status = STATUS.UNSTARTED;
let dataMode = DATA_MODE.SLOW;
const masterIndex = {};

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

			console.log('masterIndex', masterIndex);
		});
	}
}

export default {
	iniateBuild() {
		if (status === STATUS.UNSTARTED) {
			status = STATUS.STARTED;
			buildIndexData();
		} else {
			console.log('masterIndex Built:', masterIndex);
		}
	},
	getStatus(): STATUS {
		return status;
	},
	getRoll(path: string) {
		console.log('path - array', path.split('/'));
	}
};
