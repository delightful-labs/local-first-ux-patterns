<script>
	import TwoColumns from '$lib/components/layout/TwoColumns.svelte'
</script>

<TwoColumns>
	<div slot="left" class="text-wrapper">
		<h2>I'm a front-end developer that spends a lot of time with limited network access</h2>
	</div>
	<div slot="right" class="image-wrapper">
		<img src="/images/africa.png" alt="a pixel version of a map of Africa" />
	</div>
</TwoColumns>
