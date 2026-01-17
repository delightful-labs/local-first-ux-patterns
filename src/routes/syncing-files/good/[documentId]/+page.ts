import type { PageLoad } from './$types'

export const load = (({ params }) => {
	return {
		documentId: params.documentId
	}
}) satisfies PageLoad
