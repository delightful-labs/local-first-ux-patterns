<script lang="ts">
	import type { Document } from '$lib/machines/syncingFilesMachine'
	import Button from './Button.svelte'
	import { browser } from '$app/environment'

	interface Props {
		unsyncedDocuments: Document[]
	}

	let { unsyncedDocuments }: Props = $props()

	let showList = $state(false)
	let listElement: HTMLDivElement | null = $state(null)

	const toggleList = () => {
		showList = !showList
	}

	const count = $derived(unsyncedDocuments.length)

	// Close when clicking outside
	let containerElement: HTMLDivElement | null = $state(null)

	if (browser) {
		$effect(() => {
			if (!showList) return

			const handleClickOutside = (event: MouseEvent) => {
				const target = event.target as Node
				// Close if click is outside both the container (button) and the list
				if (
					containerElement &&
					!containerElement.contains(target) &&
					listElement &&
					!listElement.contains(target)
				) {
					showList = false
				}
			}

			// Use setTimeout to avoid immediate trigger from the button click
			const timeoutId = setTimeout(() => {
				document.addEventListener('click', handleClickOutside)
			}, 0)

			return () => {
				clearTimeout(timeoutId)
				document.removeEventListener('click', handleClickOutside)
			}
		})
	}
</script>

<div class="container" bind:this={containerElement}>
	<Button onclick={toggleList} aria-label="Show unsynced documents">
		Unsynced ({count})
	</Button>
	{#if showList && unsyncedDocuments.length > 0}
		<div class="list" bind:this={listElement}>
			<ul>
				{#each unsyncedDocuments as doc}
					<li>
						<span class="title">{doc.title}</span>
						<span class="status" data-status={doc.syncStatus}>
							{doc.syncStatus === 'syncing' ? 'Syncing...' : 'Pending'}
						</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.container {
		position: relative;
	}

	.list {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		background: white;
		border: var(--border-width) solid;
		box-shadow: var(--box-shadow-3d);
		min-width: 300px;
		max-width: 400px;
		z-index: 100;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		max-height: 400px;
		overflow-y: auto;
	}

	li {
		padding: 1rem;
		border-bottom: var(--border-width) solid;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	li:last-child {
		border-bottom: 0;
	}

	.title {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.status {
		font-size: 0.875rem;
		color: #666;
		font-style: italic;
	}

	.status[data-status='syncing'] {
		color: var(--color-info);
	}
</style>
