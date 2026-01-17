import type { ActorRefFrom } from 'xstate'
import type { syncingFilesMachine } from '$lib/machines/syncingFilesMachine'

// Track active sync operations per actor instance
const syncOperations = new WeakMap<
	ActorRefFrom<typeof syncingFilesMachine>,
	{
		timeoutId: ReturnType<typeof setTimeout> | null
		isActive: boolean
		networkState: 'disconnected' | 'connecting' | 'connected' | null
	}
>()

/**
 * Simulates slow syncing of documents one by one when going online
 */
export function setupSlowSyncing(
	actor: ActorRefFrom<typeof syncingFilesMachine>,
	networkState: 'disconnected' | 'connecting' | 'connected'
) {
	const snapshot = actor.getSnapshot()
	const machineState = snapshot.value
	const pendingDocs = snapshot.context.documents.filter((doc) => doc.syncStatus === 'pending')
	const syncingDocs = snapshot.context.documents.filter((doc) => doc.syncStatus === 'syncing')

	// Initialize sync operation tracking for this actor
	if (!syncOperations.has(actor)) {
		syncOperations.set(actor, { timeoutId: null, isActive: false, networkState: null })
	}
	const syncOp = syncOperations.get(actor)!

	// Update network state tracking
	syncOp.networkState = networkState

	// If we're online and in offline state with pending docs, transition to syncing
	if (networkState === 'connected' && machineState === 'offline' && pendingDocs.length > 0) {
		actor.send({ type: 'GO_ONLINE' })
		// After sending GO_ONLINE, the machine will transition to syncing state
		// We'll start syncing in the next check
		return
	}

	// If we're in syncing state and have documents to sync, sync them one by one
	if (networkState === 'connected' && machineState === 'syncing') {
		const docsToSync = syncingDocs.length > 0 ? syncingDocs : pendingDocs

		if (docsToSync.length > 0 && !syncOp.isActive) {
			syncOp.isActive = true

			const syncNext = () => {
				// Check current state before proceeding
				const currentSnapshot = actor.getSnapshot()
				const currentMachineState = currentSnapshot.value
				const currentSyncing = currentSnapshot.context.documents.filter(
					(doc) => doc.syncStatus === 'syncing'
				)

				// Only continue if we're still online, in syncing state, and have documents to sync
				if (
					syncOp.networkState === 'connected' &&
					currentMachineState === 'syncing' &&
					currentSyncing.length > 0
				) {
					const doc = currentSyncing[0] // Always sync the first syncing document
					// Delay between 1-3 seconds (not more than a few seconds)
					const delay = Math.random() * 2000 + 1000 // 1000-3000ms delay
					syncOp.timeoutId = setTimeout(() => {
						// Double-check state before syncing
						const latestSnapshot = actor.getSnapshot()
						const latestDoc = latestSnapshot.context.documents.find((d) => d.id === doc.id)
						if (
							syncOp.networkState === 'connected' &&
							latestSnapshot.value === 'syncing' &&
							latestDoc &&
							latestDoc.syncStatus === 'syncing'
						) {
							actor.send({ type: 'DOCUMENT_SYNCED', documentId: doc.id })
						}
						// Continue syncing next document
						syncNext()
					}, delay)
				} else {
					syncOp.isActive = false
				}
			}

			// Start syncing after a short delay
			if (syncOp.timeoutId) clearTimeout(syncOp.timeoutId)
			syncOp.timeoutId = setTimeout(() => {
				syncNext()
			}, 300)
		}
	}

	// If we go offline, cancel syncing and mark syncing documents as pending again
	if (networkState === 'disconnected' || networkState === 'connecting') {
		if (syncOp.timeoutId) {
			clearTimeout(syncOp.timeoutId)
			syncOp.timeoutId = null
		}
		syncOp.isActive = false
		const currentSnapshot = actor.getSnapshot()
		const currentlySyncing = currentSnapshot.context.documents.filter(
			(doc) => doc.syncStatus === 'syncing'
		)
		if (currentlySyncing.length > 0 && currentSnapshot.value !== 'offline') {
			actor.send({ type: 'GO_OFFLINE' })
		}
	}
}
