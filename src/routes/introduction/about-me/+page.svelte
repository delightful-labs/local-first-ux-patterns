<script>
	import TwoColumns from '$lib/components/layout/TwoColumns.svelte'
</script>

<TwoColumns>
	<div slot="left">
		<h2>I'm a front-end developer that spends a lot of time with limited network access</h2>
	</div>
	<img slot="right" src="/images/africa.png" alt="a pixel version of a map of Africa" />
</TwoColumns>

<style>
	img {
		align-self: center;
	}

	div {
		align-self: center;
	}

	h2 {
		font-size: 2.5rem;
	}
</style>
