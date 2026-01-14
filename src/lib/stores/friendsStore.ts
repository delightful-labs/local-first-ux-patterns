import { writable } from 'svelte/store'
import { friends as initialFriends } from '$lib/data/friends'
import type { Friend } from '$lib/data/friends'

export const friends = writable<Friend[]>(initialFriends)
