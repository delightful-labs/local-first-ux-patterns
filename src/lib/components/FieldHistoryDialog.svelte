<script lang="ts">
	import Dialog from './Dialog.svelte'
	import Button from './Button.svelte'
	import type { FormField, FieldHistoryEntry } from '$lib/machines/formMachine'

	interface Props {
		open?: boolean
		field: FormField | null
		onClose?: () => void
		onRevert?: (fieldId: string, historyIndex: number) => void
	}

	let { open = $bindable(false), field, onClose, onRevert }: Props = $props()

	const formatTime = (date: Date | undefined) => {
		if (!date) return ''
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		}).format(date)
	}

	function handleRevert(historyIndex: number) {
		if (field && onRevert) {
			onRevert(field.id, historyIndex)
		}
		open = false
		if (onClose) {
			onClose()
		}
	}

	// Combine current value with history, showing most recent first
	const historyWithCurrent = $derived(() => {
		if (!field) return []
		const entries: (FieldHistoryEntry & { isCurrent: boolean; originalIndex?: number })[] = []

		// Add current value as the first entry
		if (field.value) {
			entries.push({
				value: field.value,
				editedBy: field.lastEditedBy || 'Unknown',
				editedAt: field.lastEditedAt || new Date(),
				isCurrent: true
			})
		}

		// Add history entries in reverse order (newest previous value first)
		// Store original index so we can revert correctly
		if (field.history && field.history.length > 0) {
			for (let i = field.history.length - 1; i >= 0; i--) {
				entries.push({
					...field.history[i],
					isCurrent: false,
					originalIndex: i
				})
			}
		}

		return entries
	})
</script>

<Dialog bind:open title={field ? `History: ${field.label}` : 'History'}>
	{#if field && historyWithCurrent().length > 0}
		<div class="history-list">
			{#each historyWithCurrent() as entry, index}
				<div class="history-entry" class:current={entry.isCurrent}>
					<div class="history-content">
						<div class="history-value">{entry.value}</div>
						<div class="history-meta">
							<span class="history-editor">{entry.editedBy}</span>
							<span class="history-time">{formatTime(entry.editedAt)}</span>
							{#if entry.isCurrent}
								<span class="current-badge">Current</span>
							{/if}
						</div>
					</div>
					{#if !entry.isCurrent && entry.originalIndex !== undefined}
						<Button onclick={() => handleRevert(entry.originalIndex!)}>Revert</Button>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<p>No history available for this field.</p>
	{/if}
</Dialog>

<style>
	.history-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-height: 400px;
		overflow-y: auto;
	}

	.history-entry {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		padding: 0.75rem;
		border: var(--border-width) solid #e5e5e5;
		border-radius: 0.25rem;
	}

	.history-entry.current {
		background-color: white;
		border-color: #4a90e2;
	}

	.history-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.history-value {
		font-weight: 500;
		word-break: break-word;
	}

	.history-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.875rem;
	}

	.history-editor {
		font-weight: 500;
	}

	.history-time {
		font-style: italic;
	}

	.current-badge {
		background-color: #4a90e2;
		color: white;
		padding: 0.125rem 0.5rem;
		border-radius: 0.125rem;
		font-size: 0.75rem;
		font-weight: 600;
	}
</style>
