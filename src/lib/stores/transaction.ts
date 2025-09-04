import type { ITransaction } from '$lib/types/transaction';
import { writable } from 'svelte/store';

export const transactions = writable<ITransaction[]>([]);
