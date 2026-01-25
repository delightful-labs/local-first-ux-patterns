import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { friends as friendsStore } from '$lib/stores/friendsStore'
import { get } from 'svelte/store'

export const load = (() => {
	const friends = get(friendsStore)
	
	if (friends.length > 0) {
		const firstFriend = friends[0]
		throw redirect(302, `/messages/bad/${firstFriend.id}`)
	}

	// If no friends, return empty data (page will handle waiting for friends)
	return {}
}) satisfies PageLoad
