// Data here is the files from static/exampleTableData but as base64 encoding so can be written to drive
export default {
	Readme: `### Collections\n\nNew collections of tables should sit under\n'Fantasy-Tables/Collections'\nwithin their own folder, inside each uniquely named folder should be an index.json file eg:\n'Fantasy-Tables/Collections/castles/index.json'\n\n### Views\n\nNew views should be placed under\n'Fantasy-Tables/Views'`,
	castlesIndex: `{"collectionID": "castle","collectionName": "Medieval Castles","category": "Place","isUtility": false,"tags": ["place", "medieval", "low-fantasy"],"tables": { "castle": ["medieval"], "castle-japan": ["japanese"] }}`,
	castlesMain: `{"medieval": {"label": "Medieval European Castle","tableSections": [{"id": "castle-name","name": "Castle Name","table": ["{{name/place/medieval:Name}} Castle", "{{name/place/medieval:Name}} Redoubt"],"type": "simple"},{"id": "castle-type","name": "Castle Type:","table": ["large wooden Castle", "Small hillfort"],"type": "simple"}]},"test": {"label": "Test multiname packet","tableSections": [{"id": "castle-name","name": "Castle Name","table": ["{{name/place/medieval:Name}}-{{name/place/japan:Name}} Castle"],"type": "simple"}]},"testDefault": {"label": "Test No collection & backup call value","tableSections": [{"id": "castle-name","name": "Castle Name","table": ["{{name/place/SDFD:Name}} Castle"],"type": "simple"}]}}`,
	castlesJapan: `{"japanese": {"label": "Japanese Castle","tableSections": [{"id": "castle-name","name": "Castle Name:","table": ["{{name/place/japan:Name}} Castle", "{{name/place/japan:Name}} Fort"],"type": "simple"},{"id": "castle-type","name": "Castle Type:","table": ["large wooden Castle", "Small hillfort"],"type": "simple"}]}}`,
	namesIndex: ``,
	namesPlaces: ``
};
