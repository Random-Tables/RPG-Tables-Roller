/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
	userid: string;
}
export type tableIndex = {
	collectionID: string, // used as address
	collectionName: string,  // Readable Name
	category: string, // preferred category
	isUtility: boolean, // If true not shown, but used in background
	tags: string[],
	tables: string[], // list of tableIds 
}
export type tableItem = {
	tableID: string,
	tableSections: object,
}
export type tableData = tableItem[];