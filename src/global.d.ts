/// <reference types="@sveltejs/kit" />
interface Window {
	__TAURI__: any;
}
interface FileEntry {
	path: string;
	/**
	 * Name of the directory/file
	 * can be null if the path terminates with `..`
	 */
	name?: string;
	/** Children of this entry if it's a directory; null otherwise */
	children?: FileEntry[];
}
type tableIndex = {
	collectionID: string; // used as address
	collectionName: string; // Readable Name
	required?: string[]; // Used to relay to user if any externally used tables are missing
	category?: string; // preferred category
	isUtility?: boolean; // If true not shown in main list, but used in background
	tags?: string[]; // for future searching / categorisation
	tables?: object; // list of tableIds
	description?: string; // Optional 
	path: string; // root filepath
};
type tableItem = {
	label: string;
	tableSections: tableSection[];
};
type tableUtilityItem = {
	name: string;
	table: string[];
};
type tableSection = {
	name: string;
	type: string; // futureproofing for table type variations, current options; "simple"
	table: string[];
};
type indexTableData = {
	data: tableItem;
	dataReady: boolean;
	tableList: string[];
};
type fileData = {
	name: string;
	path: string;
};
type projList = fileData[];
type projSubfolders = {
	name: string;
	data: Array<Object>;
};
type projFolder = {
	name: string;
	data: Array<Object>;
	subfolders?: Array<projSubfolders>;
};
type projData = {
	name: string;
	lastEdit: string;
	folders: Array<projFolder>;
};
type folderKey = {
	text: string;
	value: string;
}

interface ChoiceCall {
	collection: string;
	tablesGroupKey: string;
	tableName: string;
}
interface Choice {
	data?: Array<Array<string>>;
	utility?: string;
	type: CHOICE_TYPE;
	call: ChoiceCall;
}

enum CHOICE_TYPE {
	string = 'string',
	npc
}

// Project Interfaces

interface subfolder {
	name: string;
	expanded: boolean;
	data: Array<Choice>;
}
