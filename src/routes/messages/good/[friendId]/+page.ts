import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { friends as friendsStore } from '$lib/stores/friendsStore'
import { get } from 'svelte/store'

export const load = (({ params }) => {
	const friends = get(friendsStore)
	const friend = friends.find((f) => f.id === params.friendId)

	if (!friend) {
		throw error(404, 'Friend not found')
	}

	return {
		friend
	}
}) satisfies PageLoad
