<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		open?: boolean
		onClose?: () => void
		title?: string
		children?: Snippet
	}

	let { open = $bindable(false), onClose, title, children }: Props = $props()

	let dialogRef: HTMLDialogElement | null = $state(null)
	let backdropRef: HTMLDivElement | null = $state(null)

	$effect(() => {
		if (open) {
			show()
		} else {
			close()
		}
	})

	function show() {
		if (dialogRef) {
			dialogRef.show()
		}
		if (backdropRef) {
			backdropRef.style.display = 'block'
		}
	}

	function close() {
		if (dialogRef) {
			dialogRef.close()
		}
		if (backdropRef) {
			backdropRef.style.display = 'none'
		}
		open = false
		if (onClose) {
			onClose()
		}
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
</script>

<div
	bind:this={backdropRef}
	class="dialog-backdrop"
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
<dialog bind:this={dialogRef} class="dialog" onclick={handleDialogClick}>
	{#if title}
		<h2 class="dialog-title">{title}</h2>
	{/if}
	{#if children}
		{@render children()}
	{/if}
</dialog>

<style>
	.dialog-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.1);
		z-index: 9998;
		display: none;
	}

	.dialog {
		padding: 1rem;
		background: white;
		border: var(--border-width) solid black;
		border-radius: 0.25rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		min-width: 200px;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		width: fit-content;
		height: fit-content;
		max-width: 90vw;
		max-height: 90vh;
		z-index: 9999;
		transform: none;
	}

	.dialog-title {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		font-weight: 600;
	}
</style>
