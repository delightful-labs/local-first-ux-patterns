import { createActor } from 'xstate'
import { syncingFilesMachine } from '$lib/machines/syncingFilesMachine'

// Create a singleton actor for the syncing files machine
let syncingFilesActorInstance: ReturnType<typeof createActor<typeof syncingFilesMachine>> | null = null

/**
 * Get the syncing files machine actor (for use in components)
 */
export function getSyncingFilesActor() {
	if (!syncingFilesActorInstance) {
		syncingFilesActorInstance = createActor(syncingFilesMachine)
		syncingFilesActorInstance.start()
	}
	return syncingFilesActorInstance
}
