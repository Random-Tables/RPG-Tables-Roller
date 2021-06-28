/// <reference types="@sveltejs/kit" />
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
	collectionID: string, // used as address
	collectionName: string,  // Readable Name
	category?: string, // preferred category
	isUtility?: boolean, // If true not shown, but used in background
	tags?: string[],
	tables?: object, // list of tableIds
	description?: string,
}
type tableItem = {
	label: string,
	tableSections: tableSection[],
}
type tableSection = {
	id: string,
	name: string,
	type: string, // futureproofing for table type variations, current options; "simple"
	table: string[],
}
