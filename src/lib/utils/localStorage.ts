import { browser } from '$app/environment'

export function loadFromStorage<T>(key: string): T | null {
	if (!browser) return null

	try {
		const item = localStorage.getItem(key)
		return item ? JSON.parse(item) : null
	} catch {
		return null
	}
}

export function saveToStorage<T>(key: string, data: T): void {
	if (!browser) return

	try {
		localStorage.setItem(key, JSON.stringify(data))
	} catch (error) {
		console.warn('Failed to save to localStorage:', error)
	}
}
