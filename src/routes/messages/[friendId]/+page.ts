import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { friends } from '$lib/data/friends'

export const load = (({ params }) => {
	const friend = friends.find((f) => f.id === params.friendId)

	if (!friend) {
		throw error(404, 'Friend not found')
	}

	return {
		friend
	}
}) satisfies PageLoad
