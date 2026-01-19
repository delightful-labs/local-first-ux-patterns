<div class="two-columns">
	<slot name="left" />
	<slot name="right" />
</div>

<style>
	.two-columns {
		max-width: 120ch;
		margin: 0 auto;
		padding-block: 4rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		height: 100%;
	}
</style>
