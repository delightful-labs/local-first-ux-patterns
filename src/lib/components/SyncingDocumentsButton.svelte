<script lang="ts">
	import type { Document } from '$lib/machines/syncingFilesMachine'

	interface Props {
		unsyncedDocuments: Document[]
	}

	let { unsyncedDocuments }: Props = $props()

	const count = $derived(unsyncedDocuments.length)
</script>

{#if unsyncedDocuments.length > 0}
	<details class="accordion">
		<summary class="summary">
			Unsynced ({count})
		</summary>
		<div class="list">
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
	</details>
{/if}

<style>
	.accordion {
		background: white;
		border-bottom: var(--border-width) solid;
	}

	.summary {
		padding: 0.75rem 1rem;
		cursor: pointer;
		user-select: none;
		font-weight: 500;
	}

	.list {
		border-top: var(--border-width) solid;
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
		font-style: italic;
	}

	.status[data-status='syncing'] {
		color: var(--color-info);
	}
</style>
