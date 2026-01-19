<script>
	import TwoColumns from '$lib/components/layout/TwoColumns.svelte'
</script>

<TwoColumns>
	<div slot="left">
		<h2>A lot of apps aren't design for when you have no network access</h2>
	</div>
	<img
		slot="right"
		src="/images/phone.svg"
		alt="a phone showing the text 'Please connect to the network to access'"
	/>
</TwoColumns>

<style>
	img {
		align-self: center;
	}
</style>
