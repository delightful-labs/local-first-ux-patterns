import type { LayoutLoad } from './$types'
import { friends } from '$lib/data/friends'

export const load = (async () => {
	return {
		friends
	}
}) satisfies LayoutLoad
