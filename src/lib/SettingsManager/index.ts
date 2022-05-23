import { STATUS, THEME } from '$lib/enums';
import { writable, get } from 'svelte/store';

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
		max: '28',
		onChangeFunc: (newValue) => {
			const root = document.querySelector(':root') as HTMLElement;
			const parsedVal = parseInt(newValue, 10);

			if (parsedVal >= 12 && parsedVal <= 28) {
				root.style.fontSize = newValue + 'px';
			}
		}
	},
	{
		key: 'theme',
		text: 'Visual Theme',
		default: 'fantasy',
		type: settingsTypes.select,
		choices: ['fantasy', 'horror-mystery']
	}
];
const defaultVal = {
	showCopyToClipboad: false,
	fontSize: 16,
	theme: THEME.fantasy
} as Object;

export const settingsStore = writable(defaultVal);

function saveFile() {
	return new Promise(() => {
		(async () => {
			const FileSys = await import(`../FileSys/index.js`);
			const settingsJSON = JSON.stringify(get(settingsStore));
			FileSys.default.saveSettingsFile(settingsJSON);
		})();
	});
}

export default {
	buildFromFile: async function (): Promise<Object> {
		settingsLoaded = STATUS.STARTED;
		return new Promise((resolve, reject) => {
			(async () => {
				const FileSys = await import(`../FileSys/index.js`);

				FileSys.default
					.getSettingsFile()
					.then(function (settingsJSON) {
						settingsLoaded = STATUS.BUILT;
						settingsStore.set(settingsJSON as Object);
						resolve(settingsJSON);
					})
					.catch(function (err) {
						saveFile();
						settingsLoaded = STATUS.BUILT;
						settingsStore.set(defaultVal);
						reject();
					});
			})();
		});
	},
	saveFile: saveFile,
	changeSettings(setting, newValue) {
		settingsStore.update((originalObj) => {
			const newObj = Object.assign({}, originalObj);
			newObj[setting] = newValue;
			return newObj;
		});
		this.saveFile();
	},
	getStatus: function () {
		return settingsLoaded;
	}
};
