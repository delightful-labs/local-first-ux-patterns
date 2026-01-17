<script lang="ts">
	interface Props {
		class?: string
		width?: number
		height?: number
		'aria-label'?: string
	}

	let { class: className = '', width = 16, height = 16, 'aria-label': ariaLabel }: Props = $props()
</script>

<svg
	class={className}
	{width}
	{height}
	viewBox="0 0 16 16"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	aria-label={ariaLabel}
>
	<circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
	<path d="M8 4v4M8 10h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>

<style>
	:global(.error-icon) {
		color: var(--color-error, #dc2626);
	}
</style>
