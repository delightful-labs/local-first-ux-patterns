<script>
	import NetworkStatusIndicator from '$lib/components/NetworkStatusIndicator.svelte'
	import NetworkStatusButton from '$lib/components/NetworkStatusButton.svelte'
</script>

<header>
	<NetworkStatusIndicator />
	<NetworkStatusButton />
</header>

<style>
	header {
		position: sticky;
		top: 0;
		display: grid;
		grid-template-columns: 16ch 20ch;
		gap: 1rem;
		align-items: center;
		padding: 1rem 2rem;
		border-bottom: var(--border-width) solid;
		background-color: white;
	}
</style>
