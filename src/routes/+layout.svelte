<script>
	import favicon from '$lib/assets/favicon.svg'
	import ToastContainer from '$lib/components/ToastContainer.svelte'
	let { children } = $props()
	import './styles.css'
	import Header from '$lib/components/Header.svelte'
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main>
	<Header />
	<div class="content">
		{@render children()}
	</div>
</main>
<ToastContainer />

<style>
	main {
		display: grid;
		grid-template-rows: auto 1fr;
		height: 100vh;
	}

	.content {
		overflow-y: auto;
	}
</style>
