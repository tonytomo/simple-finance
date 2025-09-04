export function store<T>(key: string, value: T) {
	localStorage.setItem(key, JSON.stringify(value));
}

export function get<T>(key: string): T | null {
	const value = localStorage.getItem(key);
	return value ? JSON.parse(value) : null;
}

export function remove(key: string) {
	localStorage.removeItem(key);
}

export function clear() {
	localStorage.clear();
}
