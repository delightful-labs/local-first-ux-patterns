import type { LayoutLoad } from './$types'
import { friends as friendsStore } from '$lib/stores/friendsStore'
import { get } from 'svelte/store'

export const load = (async () => {
	return {
		friends: get(friendsStore)
	}
}) satisfies LayoutLoad
