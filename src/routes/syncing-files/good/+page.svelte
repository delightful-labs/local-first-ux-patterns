<script lang="ts">
	import { getSyncingFilesActor } from '$lib/stores/syncingFilesStore'
	import { getNetworkStatusActor } from '$lib/stores/networkStatusStore'
	import { browser } from '$app/environment'
	import DocumentListWithSync from '$lib/components/DocumentListWithSync.svelte'
	import SyncingDocumentsButton from '$lib/components/SyncingDocumentsButton.svelte'
	import { setupSlowSyncing } from '$lib/utils/syncingUtils'
	import DocumentListWrapper from '$lib/components/DocumentListWrapper.svelte'

	const filesActor = getSyncingFilesActor()
	const networkActor = getNetworkStatusActor()

	let filesSnapshot = $state(filesActor.getSnapshot())
	let networkSnapshot = $state(networkActor.getSnapshot())

	if (browser) {
		$effect(() => {
			const filesSubscription = filesActor.subscribe((newSnapshot) => {
				filesSnapshot = newSnapshot
			})
			const networkSubscription = networkActor.subscribe((newSnapshot) => {
				networkSnapshot = newSnapshot
			})
			return () => {
				filesSubscription.unsubscribe()
				networkSubscription.unsubscribe()
			}
		})
	}

	const documents = $derived(filesSnapshot?.context.documents || [])
	const unsyncedDocuments = $derived(
		documents.filter((doc) => doc.syncStatus === 'pending' || doc.syncStatus === 'syncing')
	)

	// Handle slow syncing when going online
	// Watch both network state and files machine state
	$effect(() => {
		const currentState = networkSnapshot.value as 'disconnected' | 'connecting' | 'connected'
		const filesState = filesSnapshot?.value // Explicitly reference to make effect reactive
		// Trigger syncing when either network or files state changes
		setupSlowSyncing(filesActor, currentState)
	})
</script>

<DocumentListWrapper>
	<SyncingDocumentsButton {unsyncedDocuments} slot="sidebar" />
	<DocumentListWithSync
		slot="list"
		{documents}
		showSyncStatus={true}
		allowClickUnsynced={false}
		basePath="/syncing-files/good"
	/>
</DocumentListWrapper>
