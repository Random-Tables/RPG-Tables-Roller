# SveltKit + Tauri

Lightweight Desktop application start

## Tauri Setup

[Follow the setup guide for your OS](https://tauri.studio/en/docs/getting-started/intro)

## Testing & working Applications

- Linux Mint (Kernel: 5.4.0-37-generic x86_64 bits: 64 compiler: gcc v: 7.5.0
  Desktop: Cinnamon 4.4.8 wm: muffin dm: LightDM Distro: Linux Mint 19.3 Tricia
  base: Ubuntu 18.04 bionic) [Broken - Fixed PR'd awaiting release]
- Edition	Windows 10 Pro, Version	20H2, OS build	19042.685, Experience	Windows Feature Experience Pack 120.2212.551.0


## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.

### Tauri Build

`yarn tauri build`