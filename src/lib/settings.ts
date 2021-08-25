import { writable } from 'svelte/store';

export const types = {
    bool: "boolean"
}
export const settings = {
	showTableLinkCopyBtn: {
        text: "Show Table-Link copy to clipboard button",
        default: false,
        type: types.bool
    },
	largerText: {
        text: "Larger text",
        default: false,
        type: types.bool
    },
};

const defaults = {};
Object.keys(settings).forEach((key) => {
  defaults[key] = settings[key].default
})

export const settingsStatus = writable(defaults);
