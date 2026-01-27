<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		onclick?: (e: MouseEvent) => void
		disabled?: boolean
		'aria-label'?: string
		children?: Snippet
	}

	let { onclick, disabled = false, 'aria-label': ariaLabel, children }: Props = $props()
</script>

<button class="button" {onclick} {disabled} aria-label={ariaLabel}>
	{#if children}
		{@render children()}
	{/if}
</button>

<style>
	.button {
		font: inherit;
		padding: 0.5rem 1rem;
		border: var(--border-width) solid black;
		border-radius: 0;
		background-color: white;
		color: black;
		box-shadow: var(--box-shadow-3d);
		transition:
			background-color 0.2s,
			color 0.2s,
			transform 0.1s,
			box-shadow 0.1s;
	}

	.button:hover:not(:disabled) {
		background-color: black;
		color: white;
	}

	.button:active:not(:disabled) {
		box-shadow: 0 0 0 0 black;
		transform: translate(4px, 4px);
	}

	.button:disabled {
		opacity: 0.5;
	}

	.button:focus-visible {
		outline: 2px solid #4a90e2;
		outline-offset: 2px;
	}
</style>
