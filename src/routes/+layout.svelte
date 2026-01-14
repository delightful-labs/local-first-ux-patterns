<script>
	import favicon from '$lib/assets/favicon.svg'
	import ToastContainer from '$lib/components/ToastContainer.svelte'
	export const ssr = false
	let { children } = $props()
	import './styles.css'
	import Header from '$lib/components/Header.svelte'
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header />

{@render children()}

<ToastContainer />
