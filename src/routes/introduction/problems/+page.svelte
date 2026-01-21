<script>
	import TwoColumns from '$lib/components/layout/TwoColumns.svelte'
</script>

<TwoColumns>
	<div slot="left" class="text-wrapper">
		<h2>A lot of apps aren't designed for when you have no network access</h2>
		<ul>
			<li>Not handling lie-fi</li>
			<li>Downloaded content not really available offline</li>
			<li>Not knowing if content is available offline or has been synced to the server</li>
		</ul>
		<p>These apps have offline features, <strong>but they are local-last</strong></p>
	</div>
	<div slot="right" class="image-wrapper">
		<img
			src="/images/phone.svg"
			alt="a phone showing the text 'Please connect to the network to access'"
		/>
	</div>
</TwoColumns>

<style>
	p {
		margin-top: 2rem;
	}
</style>
