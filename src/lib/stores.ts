import { writable } from 'svelte/store';
import { STATUS } from '$lib/enums';

export const viewsBuilt = writable(STATUS.UNSTARTED);

export const choiceArrayStore = writable([]);