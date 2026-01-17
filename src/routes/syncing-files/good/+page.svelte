<script lang="ts">
	import { getSyncingFilesActor } from '$lib/stores/syncingFilesStore'
	import { getNetworkStatusActor } from '$lib/stores/networkStatusStore'
	import { browser } from '$app/environment'
	import DocumentListWithSync from '$lib/components/DocumentListWithSync.svelte'
	import SyncingDocumentsButton from '$lib/components/SyncingDocumentsButton.svelte'
	import { setupSlowSyncing } from '$lib/utils/syncingUtils'

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

<h1>Syncing Files (Good)</h1>
<div class="controls">
	<SyncingDocumentsButton {unsyncedDocuments} />
</div>
<div class="list-wrapper">
	<DocumentListWithSync {documents} showSyncStatus={true} allowClickUnsynced={false} basePath="/syncing-files/good" />
</div>

<style>
	h1 {
		margin: 0 0 2rem 0;
		font-size: 1.5rem;
		padding: 2rem 2rem 0 2rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.controls {
		padding: 0 2rem;
		max-width: 600px;
		margin: 0 auto 1rem auto;
		display: flex;
		justify-content: flex-end;
	}

	.list-wrapper {
		box-sizing: border-box;
		height: calc(100svh - 12rem);
		display: flex;
		flex-direction: column;
		padding: 2rem;
		max-width: 600px;
		margin: 0 auto;
	}
</style>
