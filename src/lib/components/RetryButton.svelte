<script lang="ts">
	import Button from './Button.svelte'
	import WarningIcon from './WarningIcon.svelte'
	import Dialog from './Dialog.svelte'

	interface Props {
		messageId: string
		message: string
		onRetry: () => void
	}

	let { messageId, message, onRetry }: Props = $props()

	let isOpen = $state(false)

	function handleRetry() {
		onRetry()
		isOpen = false
	}

	function handleButtonClick() {
		isOpen = true
	}
</script>

<button
	class="error-icon-button"
	onclick={handleButtonClick}
	aria-label="Failed to send - click to retry"
>
	<WarningIcon class="error-icon" />
</button>

<Dialog bind:open={isOpen}>
	<p>{message}</p>
	<Button onclick={handleRetry}>Retry</Button>
</Dialog>

<style>
	.error-icon-button {
		flex-shrink: 0;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.error-icon) {
		color: var(--color-error, #dc2626);
		height: 32px;
		width: 32px;
		background-color: white;
		border-radius: 50%;
		padding: 2px;
	}

	:global(.dialog p) {
		margin: 0 0 0.75rem 0;
	}
</style>
