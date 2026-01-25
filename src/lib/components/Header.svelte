<script>
	import NetworkStatusIndicator from '$lib/components/NetworkStatusIndicator.svelte'
	import NetworkStatusButton from '$lib/components/NetworkStatusButton.svelte'
</script>

<header>
	<NetworkStatusIndicator />
	<NetworkStatusButton />
	<div class="logo-container">
		<img src="/images/delightfullabs-logo.svg" alt="Delightful Labs Logo" />
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		display: grid;
		grid-template-columns: 16ch 20ch 1fr;
		gap: 1rem;
		align-items: center;
		padding: 1rem 2rem;
		border-bottom: var(--border-width) solid;
		background-color: white;
	}

	.logo-container {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	img {
		height: 3rem;
		width: auto;
	}
</style>
