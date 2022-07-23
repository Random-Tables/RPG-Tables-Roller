## Building data for Table Roller

### Libraries

Data is organised into libraries, whihc are the root data source

### SubLibraries

### String Sub Calls

The main feature, this allows you to nest variation in strings, this must call a [Utility](#utility) Table as these inherently return a single value

`{{RootLibrary/SubLibrary/Table:Default Value}}`

`{{RootLibrary/SubLibrary/Table#UP:Default Value}}` - Uppercase call

`{{Number#1-20:9}}`

### Data types

##### Multi Value String:

```
"tableSections": [
			{
				"name": "Castle Name",
				"table": ["{{names/place/medieval:A}} Castle", "{{names/place/medieval:A}} Redoubt"],
				"type": "simple"
			},
			{
				"name": "Castle Type:",
				"table": ["large wooden Castle", "Small hillfort"],
				"type": "simple"
			}
		]
```

###### Multi Table Types

- String : 'simple'
```{
    "name": "Strength:",
    "table": ["{{Number#1-20:9}}", "18/50"],
    "type": "simple"
}
```


##### Utility

These values return a single value 

```
	"japan": {
		"name": "Castle Name:",
		"table": ["Himejo", "Yurijo", "Kannoji"]
	}
```
