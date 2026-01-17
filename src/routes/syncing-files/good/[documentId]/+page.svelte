<script lang="ts">
	import DocumentDetail from '$lib/components/DocumentDetail.svelte'
	import { getSyncingFilesActor } from '$lib/stores/syncingFilesStore'
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'

	let { data }: { data: { documentId: string } } = $props()

	const filesActor = getSyncingFilesActor()

	let filesSnapshot = $state(filesActor.getSnapshot())

	if (browser) {
		$effect(() => {
			const subscription = filesActor.subscribe((newSnapshot) => {
				filesSnapshot = newSnapshot
			})
			return () => subscription.unsubscribe()
		})
	}

	const document = $derived(
		filesSnapshot?.context.documents.find((doc) => doc.id === data.documentId) || null
	)

	// Redirect if document exists but is not synced
	$effect(() => {
		if (document !== null && document.syncStatus !== 'synced') {
			goto('/syncing-files/good')
		}
	})
</script>

<DocumentDetail {document} />
