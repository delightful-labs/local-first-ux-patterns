<script lang="ts">
	import type { Document } from '$lib/machines/syncingFilesMachine'
	import { browser } from '$app/environment'

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

	const getSyncStatusText = (status: Document['syncStatus']) => {
		switch (status) {
			case 'synced':
				return 'Synced - This document has been successfully synced to the server.'
			case 'syncing':
				return 'Syncing - This document is currently being synced to the server.'
			case 'pending':
				return 'Pending - This document is waiting to be synced when the connection is available.'
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

	// Track which document's popup is open (for click)
	let openPopupId = $state<string | null>(null)
	let hoveredPopupId = $state<string | null>(null)

	const handleStatusClick = (e: MouseEvent, documentId: string) => {
		e.preventDefault()
		e.stopPropagation()
		openPopupId = openPopupId === documentId ? null : documentId
	}

	const handleStatusKeyDown = (e: KeyboardEvent, documentId: string) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			e.stopPropagation()
			openPopupId = openPopupId === documentId ? null : documentId
		}
	}

	const handleStatusHover = (documentId: string) => {
		hoveredPopupId = documentId
	}

	const handleStatusLeave = () => {
		hoveredPopupId = null
	}

	const isPopupVisible = (documentId: string) => {
		return openPopupId === documentId || hoveredPopupId === documentId
	}

	// Close popup when clicking outside
	if (browser) {
		$effect(() => {
			if (!openPopupId) return

			const handleClickOutside = (event: MouseEvent) => {
				const target = event.target as Node
				const popupElements = document.querySelectorAll('.sync-status-popup')
				let clickedInsidePopup = false

				popupElements.forEach((popup) => {
					if (popup.contains(target)) {
						clickedInsidePopup = true
					}
				})

				if (!clickedInsidePopup) {
					openPopupId = null
				}
			}

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

<ul>
	{#each documents as document}
		<li class:disabled={!isClickable(document)}>
			{#if isClickable(document)}
				<a href={getDocumentUrl(document)}>
					<div class="document-header">
						<h3>{document.title}</h3>
						{#if showSyncStatus}
							<div class="sync-status-wrapper">
								<span
									class="sync-status"
									data-status={document.syncStatus}
									onclick={(e) => handleStatusClick(e, document.id)}
									onkeydown={(e) => handleStatusKeyDown(e, document.id)}
									onmouseenter={() => handleStatusHover(document.id)}
									onmouseleave={handleStatusLeave}
									role="button"
									tabindex="0"
									aria-label={getSyncStatusText(document.syncStatus)}
								>
									{getSyncIcon(document.syncStatus)}
								</span>
								{#if isPopupVisible(document.id)}
									<div class="sync-status-popup" data-status={document.syncStatus}>
										{getSyncStatusText(document.syncStatus)}
									</div>
								{/if}
							</div>
						{/if}
					</div>
					<p>{document.body.substring(0, 100)}...</p>
				</a>
			{:else}
				<div>
					<div class="document-header">
						<h3>{document.title}</h3>
						{#if showSyncStatus}
							<div class="sync-status-wrapper">
								<span
									class="sync-status"
									data-status={document.syncStatus}
									onclick={(e) => handleStatusClick(e, document.id)}
									onkeydown={(e) => handleStatusKeyDown(e, document.id)}
									onmouseenter={() => handleStatusHover(document.id)}
									onmouseleave={handleStatusLeave}
									role="button"
									tabindex="0"
									aria-label={getSyncStatusText(document.syncStatus)}
								>
									{getSyncIcon(document.syncStatus)}
								</span>
								{#if isPopupVisible(document.id)}
									<div class="sync-status-popup" data-status={document.syncStatus}>
										{getSyncStatusText(document.syncStatus)}
									</div>
								{/if}
							</div>
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
		overflow-y: auto;
		border-left: var(--border-width) solid;
	}

	li {
		padding: 0;
		border-bottom: var(--border-width) solid;
		list-style: none;
	}

	li.disabled h3,
	li.disabled p {
		color: #666;
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
		margin: 0.5rem 0;
		flex: 1;
	}

	.sync-status-wrapper {
		position: relative;
		display: inline-block;
	}

	.sync-status {
		font-size: 40px;
		font-weight: bold;
		display: inline-block;
		min-width: 40px;
		text-align: center;
		cursor: pointer;
		user-select: none;
		line-height: 1;
	}

	.sync-status:hover {
		opacity: 0.8;
	}

	.sync-status:focus {
		outline: 2px solid currentColor;
		outline-offset: 2px;
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

	.sync-status-popup {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		background: white;
		border: var(--border-width) solid;
		box-shadow: var(--box-shadow-3d);
		padding: 0.75rem 1rem;
		min-width: 200px;
		max-width: 300px;
		z-index: 100;
		font-size: 0.875rem;
		line-height: 1.4;
		white-space: normal;
		pointer-events: none;
		color: black;
		opacity: 1;
	}

	.sync-status-popup::before {
		content: '';
		position: absolute;
		bottom: 100%;
		right: 1rem;
		border: 0.5rem solid transparent;
		border-bottom-color: currentColor;
	}

	.sync-status-popup[data-status='synced'] {
		border-color: var(--color-success);
	}

	.sync-status-popup[data-status='synced']::before {
		border-bottom-color: var(--color-success);
	}

	.sync-status-popup[data-status='syncing'] {
		border-color: var(--color-info);
	}

	.sync-status-popup[data-status='syncing']::before {
		border-bottom-color: var(--color-info);
	}

	.sync-status-popup[data-status='pending'] {
		border-color: var(--color-warning);
	}

	.sync-status-popup[data-status='pending']::before {
		border-bottom-color: var(--color-warning);
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
