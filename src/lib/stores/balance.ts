import { writable } from 'svelte/store';

export const balance = writable<number>(0);
