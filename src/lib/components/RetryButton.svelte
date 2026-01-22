<script lang="ts">
	import Button from './Button.svelte'
	import WarningIcon from './WarningIcon.svelte'

	interface Props {
		messageId: string
		message: string
		onRetry: () => void
	}

	let { messageId, message, onRetry }: Props = $props()

	let dialogRef: HTMLDialogElement | null = $state(null)
	let backdropRef: HTMLDivElement | null = $state(null)
	let isOpen = $state(false)

	function show() {
		if (dialogRef) {
			dialogRef.show()
		}
		if (backdropRef) {
			backdropRef.style.display = 'block'
		}
		isOpen = true
	}

	function close() {
		if (dialogRef) {
			dialogRef.close()
		}
		if (backdropRef) {
			backdropRef.style.display = 'none'
		}
		isOpen = false
	}

	function handleRetry() {
		onRetry()
		close()
	}

	function handleDialogClick(e: MouseEvent) {
		// Close dialog if clicking on the backdrop
		if (e.target === e.currentTarget) {
			close()
		}
	}

	function handleBackdropClick() {
		close()
	}

	function handleButtonClick() {
		show()
	}
</script>

<button
	class="error-icon-button"
	onclick={handleButtonClick}
	aria-label="Failed to send - click to retry"
>
	<WarningIcon class="error-icon" />
</button>

<div
	bind:this={backdropRef}
	class="retry-dialog-backdrop"
	role="button"
	tabindex="-1"
	onclick={handleBackdropClick}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			handleBackdropClick()
		}
	}}
></div>
<dialog
	bind:this={dialogRef}
	class="retry-dialog"
	onclick={handleDialogClick}
>
	<p>{message}</p>
	<Button onclick={handleRetry}>Retry</Button>
</dialog>

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

	.retry-dialog-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.1);
		z-index: 9998;
		display: none;
	}

	.retry-dialog {
		padding: 1rem;
		background: white;
		border: var(--border-width) solid black;
		border-radius: 0.25rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		min-width: 200px;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 9999;
	}

	.retry-dialog p {
		margin: 0 0 0.75rem 0;
	}
</style>
