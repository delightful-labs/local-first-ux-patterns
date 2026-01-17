<script lang="ts">
	import type { FormField } from '$lib/machines/formMachine'
	import type { ActorRefFrom } from 'xstate'
	import type { formMachine } from '$lib/machines/formMachine'

	interface Props {
		fields: FormField[]
		formActor: ActorRefFrom<typeof formMachine>
		showEditInfo?: boolean
	}

	let { fields, formActor, showEditInfo = false }: Props = $props()

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
</script>

<div class="form-container">
	<form>
		{#each fields as field (field.id)}
			<div class="form-field">
				{#if showEditInfo}
					<div class="field-header">
						<label for={field.id}>{field.label}</label>
						{#if field.lastEditedBy && field.lastEditedAt}
							<span class="edit-info">
								Edited by {field.lastEditedBy} at {formatTime(field.lastEditedAt)}
							</span>
						{/if}
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

<style>
	.form-container {
		padding: 2rem;
		max-width: 600px;
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

	.edit-info {
		font-size: 0.75rem;
		color: #666;
		font-style: italic;
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
