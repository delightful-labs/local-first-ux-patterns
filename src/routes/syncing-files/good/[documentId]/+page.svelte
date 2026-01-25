<script lang="ts">
	import DocumentDetail from '$lib/components/DocumentDetail.svelte'
	import { getSyncingFilesActor } from '$lib/stores/syncingFilesStore'
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'

	let { data }: { data: { documentId: string } } = $props()

	const backPath = $derived($page.url.pathname.replace(/\/[^/]+$/, ''))

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

<nav class="back-link">
	<a href={backPath}>← Back to list</a>
</nav>

<DocumentDetail {document} />

<style>
	.back-link {
		padding: 1rem 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.back-link a {
		color: inherit;
		text-decoration: none;
		font-weight: 700;
	}

	.back-link a:hover,
	.back-link a:focus {
		text-decoration: underline;
	}
</style>
