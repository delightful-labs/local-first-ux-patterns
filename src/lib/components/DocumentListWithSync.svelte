<script lang="ts">
	import type { Document } from '$lib/machines/syncingFilesMachine'

	interface Props {
		documents: Document[]
		showSyncStatus?: boolean
		allowClickUnsynced?: boolean
		basePath?: string
	}

	let {
		documents,
		showSyncStatus = false,
		allowClickUnsynced = true,
		basePath = ''
	}: Props = $props()

	const getSyncIcon = (status: Document['syncStatus']) => {
		switch (status) {
			case 'synced':
				return '✓'
			case 'syncing':
				return '⟳'
			case 'pending':
				return '○'
			default:
				return ''
		}
	}

	const isClickable = (document: Document) => {
		return allowClickUnsynced || document.syncStatus === 'synced'
	}

	const getDocumentUrl = (document: Document) => {
		return `${basePath}/${document.id}`
	}
</script>

<ul>
	{#each documents as document}
		<li class:disabled={!isClickable(document)}>
			{#if isClickable(document)}
				<a href={getDocumentUrl(document)}>
					<div class="document-header">
						<h3>{document.title}</h3>
						{#if showSyncStatus}
							<span class="sync-status" data-status={document.syncStatus}>
								{getSyncIcon(document.syncStatus)}
							</span>
						{/if}
					</div>
					<p>{document.body.substring(0, 100)}...</p>
				</a>
			{:else}
				<div>
					<div class="document-header">
						<h3>{document.title}</h3>
						{#if showSyncStatus}
							<span class="sync-status" data-status={document.syncStatus}>
								{getSyncIcon(document.syncStatus)}
							</span>
						{/if}
					</div>
					<p>{document.body.substring(0, 100)}...</p>
				</div>
			{/if}
		</li>
	{/each}
</ul>

<style>
	ul {
		padding: 0;
		margin: 0;
	}

	li {
		padding: 0;
		border-bottom: var(--border-width) solid;
		list-style: none;
	}

	li.disabled {
		opacity: 0.5;
	}

	a {
		display: block;
		padding: 2rem;
		color: inherit;
		text-decoration: none;
		cursor: pointer;
	}

	a:hover {
		background-color: #f5f5f5;
	}

	li.disabled > div {
		padding: 2rem;
		cursor: default;
	}

	.document-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	h3 {
		margin: 0;
		flex: 1;
	}

	.sync-status {
		font-size: 1.2rem;
		font-weight: bold;
		display: inline-block;
		min-width: 1.5rem;
		text-align: center;
	}

	.sync-status[data-status='synced'] {
		color: var(--color-success);
	}

	.sync-status[data-status='syncing'] {
		color: var(--color-info);
		animation: spin 1s linear infinite;
	}

	.sync-status[data-status='pending'] {
		color: var(--color-warning);
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	p {
		font-family: 'FlowBlock';
		margin: 0;
		color: #666;
	}

	li:last-child {
		border-bottom: 0;
	}
</style>
