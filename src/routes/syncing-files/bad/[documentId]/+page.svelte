<script lang="ts">
	import { getSyncingFilesActor } from '$lib/stores/syncingFilesStore'
	import { browser } from '$app/environment'
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

	// In bad example: show document only if it's synced, otherwise show error
	const displayDocument = $derived(document?.syncStatus === 'synced' ? document : null)
	const showError = $derived(document !== null && document.syncStatus !== 'synced')
</script>

<nav class="back-link">
	<a href={backPath}>← Back to list</a>
</nav>

{#if displayDocument}
	<article>
		<h1>{displayDocument.title}</h1>
		<div class="body">{displayDocument.body}</div>
	</article>
{:else if showError}
	<div class="error">
		<p>Document not found</p>
	</div>
{:else}
	<div class="error">
		<p>Document not found</p>
	</div>
{/if}

<style>
	article {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		margin: 0 0 2rem 0;
		font-size: 2rem;
		border-bottom: var(--border-width) solid;
		padding-bottom: 1rem;
	}

	.body {
		font-family: 'FlowBlock';
		line-height: 1.6;
		white-space: pre-wrap;
	}

	.error {
		padding: 4rem 2rem;
		text-align: center;
		max-width: 600px;
		margin: 0 auto;
	}

	.error p {
		margin: 0;
		font-size: 1.5rem;
		color: var(--color-error, #ef4444);
	}

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
