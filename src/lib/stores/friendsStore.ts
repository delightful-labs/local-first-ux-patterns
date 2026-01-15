import { writable } from 'svelte/store'
import { friends as initialFriends } from '$lib/data/friends'
import type { Friend } from '$lib/data/friends'
import { loadFromStorage, saveToStorage } from '$lib/utils/localStorage'

const STORAGE_KEY = 'friends'

// Load from localStorage or use initial friends
const stored = loadFromStorage<Friend[]>(STORAGE_KEY)
const initialData = stored || initialFriends

// If no stored data, save initial friends to localStorage
if (!stored) {
	saveToStorage(STORAGE_KEY, initialFriends)
}

export const friends = writable<Friend[]>(initialData)

// Save to localStorage whenever store changes
friends.subscribe((friendsList) => {
	saveToStorage(STORAGE_KEY, friendsList)
})
