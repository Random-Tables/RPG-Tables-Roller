# RPG Table Roller Application

The RPG roller application is a desktop App designed as a tool for Pen & Paper RPG DM/ Creative Fantasy projects.
Like the Loot tables of DnD, it randomly generates items, places, etc.. , the unique part of this project is the modular (composable) nature of the tables file format.
In effect you can create tables replacing descriptive adjectives, such as color with a sub-table meaning each 'roll' can vary greatly adding a further layer depth of descriptiveness.
Another advantage here is the hosting of tables in modular Open Source Repository allowing for a highly extendable Open collection of tables which people can easily extend.

## Links - V1.2.0

[Windows x64](/RPG-Tables-Roller/downloads/table-roller-app_1.2.1_x64_en-US.msi)
[Linux Deb](/RPG-Tables-Roller/downloads/table-roller-app_1.2.1_amd64.deb)

### Adding Tables

Once you run the application once, you will find in your documents folder a new folder called `Fantasy-Tables` within that folder is another called `Collections`, inside this folder is where you place new tables, making sure that any folders added have an index.json file inside and not nested within another sub folder:

✔️
- Fantasy-Tables
  - Collections
    - fantasy-npc@2
      - index.json

❌

- Fantasy-Tables
  - Collections
    - fantasy-npc@2
      - new folder
        - index.json


### Desktop App ?

Currently just a desktop app as they tend to be longer lasting than web sites and it's easier to download and add custom tables to a desktop app.

If I get a good response I will look at create a toolset to help people create random table generators for their websites.

## Status

Currently the app is in it's first iteration whilst I get a feel for interest, if strong I will look into further extending it's functionality


- Tables Roller 👍
- Projects (Saved 'rolls') 👍
- themes (working but lacks polish and options) 😐

- Windows App 👍
- Linux App 👍
- Mac App 😡, either need to bite the buller abd get one or find other build alternatives

## Tables

These are the main, detailed tables currently available

- Full Collection, with required utility tables  &nbsp;&nbsp;&nbsp;[7z](/RPG-Tables-Roller/downloads/tables/tables-selection.7z) &nbsp;&nbsp;&nbsp;[zip](/RPG-Tables-Roller/downloads/tables/tables-selection.zip)

- [Biome](/RPG-Tables-Roller/downloads/tables/biome@1.7z)
  - Req: [Nature](/RPG-Tables-Roller/downloads/utilities/utility-nature@2.7z)
- [Fantasy NPC](/RPG-Tables-Roller/downloads/tables/npc-fantasy@4.7z)
  - Req: [Fantasy Names](/RPG-Tables-Roller/downloads/utilities/utility-names-fantasy@2.7z), [NPC Utilities](/RPG-Tables-Roller/downloads/utilities/utility-npc@4.7z), [NPC Fantasy Utilities](/RPG-Tables-Roller/downloads/utilities/utility-npc-fantasy@3.7z), [Senses](/RPG-Tables-Roller/downloads/utilities/utility-senses@10.7z)
- [Biome](/RPG-Tables-Roller/downloads/tables/factions@2.7z)
  - Req: [Faction Utilities](/RPG-Tables-Roller/downloads/utilities/utility-factions@2.7z)

### Utility - Tables

Used by tables above

- [Fantasy Names](/RPG-Tables-Roller/downloads/utilities/utility-names-fantasy@2.7z)
- [Names Historic](/RPG-Tables-Roller/downloads/utilities/utility-names-historic@2.7z)
- [Names](/RPG-Tables-Roller/downloads/utilities/utility-names@2.7z)
- [Nature](/RPG-Tables-Roller/downloads/utilities/utility-nature@2.7z)
- [NPC Fantasy Utilities](/RPG-Tables-Roller/downloads/utilities/utility-npc-fantasy@3.7z)
- [NPC Utilities](/RPG-Tables-Roller/downloads/utilities/utility-npc@4.7z)
- [Senses](/RPG-Tables-Roller/downloads/utilities/utility-senses@10.7z)
- [Faction Utilities](/RPG-Tables-Roller/downloads/utilities/utility-factions@2.7z) - Req (Senses)

## Creating Your own Tables

The github organisation Random-Tables contains Reos for all the Tables
https://github.com/orgs/Random-Tables/repositories
First download one and using a Text editor have a read through the .json files to get a feel for how they are built, it should be fairly simple to replicate the design format as they are quite a simple, readable format.

Tables have a few options for how they generate data, se below

### Table data types

- String : 'Just type out your text'
- Call : {{table-repo/table-group/table:Default}} - Each 'table-repo' is the id the individual collection has, below that is the grouping and within each group are the actual tables that get called.
- Number: {{Number#20-40}} Returns a random number between 20 & 40
- Dice: {{D#3d6 + 4 + 2d6}} 3d6 is 3 rolls of a 6 sided dice, you can space out multiple additions and all of them will be added together
