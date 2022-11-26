# Table Roller Application

##### What

A theasaurus for random tables (think D&D, pathfinder, etc).

This collection of tools standardises a way of collecting variations that you can pepper your random generations with a rich selection of variations.

Take a loot table for example

Instead of one of the below
`A blue spear`, `A gold key`

You can nest variability
"A {{utility-senses/color-blue/dark}} spear", "A {{utility-senses/color-material/metal-copper}} key"

will produce results such as, with variance each time you 'roll'
`A sapphire spear`, `A greened bronze key`

##### Why

Random generators are awesome, but writing them with sufficient variability to be interesting can be hard, I hope this library can add a rich depth to the tables people create

##### How

Currently only the desktop app is ready, but I'm working on a web version so people can more easily add generators to their website.

### Terminology

{{Collection/TableGroup/Table}}

### Add Collections

To Add additional collections to your available list, download the zip files from the 'releases' section of any repo within https://github.com/Random-Tables

```
--- Fantasy-Tables
  |
  |-- Collections
    |
    |-- Library1
      |
      |--index.json
      |--tableA.json
      |--tableB.json
    |
    |--Library2
      |
      |--index.json
      |--tableA.json
```

## Developer Setup

### Tauri Setup

[Follow the setup guide for your OS](https://tauri.studio/v1/guides/getting-started/prerequisites)

## Testing & working Applications

- Linux Mint (Kernel: 5.4.0-37-generic x86_64 bits: 64 compiler: gcc v: 7.5.0
  Desktop: Cinnamon 4.4.8 wm: muffin dm: LightDM Distro: Linux Mint 19.3 Tricia
  base: Ubuntu 18.04 bionic) [Broken - Fixed PR'd awaiting release]
- Edition	Windows 10 Pro, Version	20H2, OS build	19042.685, Experience	Windows Feature Experience Pack 120.2212.551.0


## Developing

!! check using required version of node.

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

To run a Tauri dev window:

```yarn tauri dev```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.

### Tauri Build

`yarn tauri build`