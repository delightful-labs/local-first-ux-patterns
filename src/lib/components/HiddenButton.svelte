<script lang="ts">
	interface Props {
		onclick?: (e: MouseEvent) => void
		'aria-label'?: string
	}

	let { onclick, 'aria-label': ariaLabel }: Props = $props()
</script>

<button class="hidden-button" {onclick} aria-label={ariaLabel}>
	<slot />
</button>

<style>
	.hidden-button {
		/* Visually hidden but accessible */
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
		padding: 0;
		margin: 0;
	}

	.hidden-button:focus {
		/* Show when focused (tab navigation) */
		position: fixed;
		top: 1rem;
		left: 1rem;
		z-index: 9999;
		width: auto;
		height: auto;
		overflow: visible;
		clip: auto;
		white-space: normal;
		padding: 0.75rem 1.5rem;
		background: black;
		color: white;
		border: 2px solid white;
		border-radius: 0.25rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
	}

	.hidden-button:focus:hover {
		background: #333;
	}
</style>
