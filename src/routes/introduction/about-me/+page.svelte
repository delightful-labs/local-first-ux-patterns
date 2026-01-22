<script>
	import TwoColumns from '$lib/components/layout/TwoColumns.svelte'
</script>

<TwoColumns>
	<div slot="left" class="text-wrapper">
		<h2>I'm a front-end developer who spends a lot of time with limited network access</h2>
		<ul>
			<li>Cellular data for all internet access</li>
			<li>Network slows down to being unusable during football games</li>
			<li>Government occasionally shuts down the internet</li>
		</ul>
	</div>
	<div slot="right" class="image-wrapper">
		<img src="/images/africa.png" alt="a pixel version of a map of Africa" />
	</div>
</TwoColumns>
