import type { IFlow } from '$lib/types/flow';
import { writable } from 'svelte/store';

export const flows = writable<IFlow[]>([]);
