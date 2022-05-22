import { STATUS, THEME } from '$lib/enums';
import { writable } from 'svelte/store';

let settingsLoaded: STATUS = STATUS.UNSTARTED;

export const settingsTypes = {
	check: 'check',
	dial: 'dial',
	select: 'select'
};

export const settingsSetup = [
	{
		key: 'showCopyToClipboad',
		text: 'Show Table-Link copy to clipboard button',
		default: false,
		type: settingsTypes.check
	},
	{
		key: 'fontSize',
		text: 'Larger text',
		default: 16,
		type: settingsTypes.dial,
		min: '12',
		max: '28'
	},
	{
		key: 'theme',
		text: 'Visual Theme',
		default: 'fantasy',
		type: settingsTypes.select,
		choices: ['fantasy', 'horror-mystery']
	}
];

export const settingsStore = writable({
	showCopyToClipboad: false,
	fontSize: 16,
	theme: THEME.fantasy
});

export default {
	buildFromFile() {
		settingsLoaded = STATUS.STARTED;
	},
	saveSettingsFile() {},
	changeSettings(setting, newValue) {
		console.log('key::' + setting, newValue);
		settingsStore.update((originalObj) => {
			const newObj = Object.assign({}, originalObj);
			newObj[setting] = newValue;
			return newObj;
		});
		// this.saveSettingsFile();
	},
	getStatus: function () {
		return settingsLoaded;
	}
};
