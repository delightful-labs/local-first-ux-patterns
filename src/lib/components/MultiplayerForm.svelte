<script lang="ts">
	import type { FormField } from '$lib/machines/formMachine'
	import type { ActorRefFrom } from 'xstate'
	import type { formMachine } from '$lib/machines/formMachine'
	import FieldHistoryDialog from './FieldHistoryDialog.svelte'

	interface Props {
		fields: FormField[]
		formActor: ActorRefFrom<typeof formMachine>
		showEditInfo?: boolean
		showHistory?: boolean
	}

	let { fields, formActor, showEditInfo = false, showHistory = false }: Props = $props()

	let selectedField: FormField | null = $state(null)
	let historyDialogOpen = $state(false)

	const handleFieldChange = (fieldId: string, value: string) => {
		formActor.send({
			type: 'UPDATE_FIELD',
			fieldId,
			value
		})
	}

	const formatTime = (date: Date | undefined) => {
		if (!date) return ''
		return new Intl.DateTimeFormat('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		}).format(date)
	}

	function openHistoryDialog(field: FormField, e?: MouseEvent) {
		if (e) {
			e.preventDefault()
			e.stopPropagation()
		}
		selectedField = field
		historyDialogOpen = true
	}

	function handleRevert(fieldId: string, historyIndex: number) {
		formActor.send({
			type: 'REVERT_FIELD',
			fieldId,
			historyIndex
		})
	}
</script>

<div class="form-container">
	<form>
		{#each fields as field (field.id)}
			<div class="form-field">
				{#if showEditInfo}
					<div class="field-header">
						<label for={field.id}>{field.label}</label>
						<div class="edit-info-container">
							{#if field.lastEditedBy && field.lastEditedAt}
								<span class="edit-info">
									Edited by {field.lastEditedBy} at {formatTime(field.lastEditedAt)}
								</span>
							{/if}
							{#if showHistory && ((field.history && field.history.length > 0) || field.lastEditedBy)}
								<button
									type="button"
									class="history-link"
									onclick={(e) => openHistoryDialog(field, e)}
								>
									View history
								</button>
							{/if}
						</div>
					</div>
				{:else}
					<label for={field.id}>{field.label}</label>
				{/if}
				<input
					id={field.id}
					type="text"
					value={field.value}
					oninput={(e) => handleFieldChange(field.id, e.currentTarget.value)}
				/>
			</div>
		{/each}
	</form>
</div>

{#if showHistory}
	<FieldHistoryDialog bind:open={historyDialogOpen} field={selectedField} onRevert={handleRevert} />
{/if}

<style>
	.form-container {
		padding: 2rem;
		max-width: 80ch;
		margin: 0 auto;
	}

	form {
		display: grid;
		gap: 1.5rem;
	}

	.form-field {
		display: grid;
		gap: 0.5rem;
	}

	.field-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
	}

	label {
		font-weight: 600;
	}

	.edit-info-container {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.edit-info {
		font-size: 0.75rem;
		font-style: italic;
	}

	.history-link {
		background: none;
		border: none;
		padding: 0;
		font-size: 0.75rem;
		color: #0066cc;
		text-decoration: underline;
		font-style: italic;
	}

	.history-link:hover {
		color: #0052a3;
		text-decoration: none;
	}

	input {
		font: inherit;
		padding: 0.75rem;
		border: var(--border-width) solid black;
		border-radius: 0;
		background-color: white;
	}

	input:focus {
		outline: 2px solid #4a90e2;
		outline-offset: 2px;
	}
</style>
