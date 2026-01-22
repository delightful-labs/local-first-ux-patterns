<div class="two-columns">
	<slot name="left" />
	<slot name="right" />
</div>

<style>
	.two-columns {
		max-width: 120ch;
		margin: 0 auto;
		padding-block: 4rem;
		padding-inline: 2rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		gap: 4rem;
		height: 100%;
		line-height: 1.5;
	}

	:global(.two-columns h2) {
		font-size: 2.5rem;
	}

	:global(.two-columns .image-wrapper) {
		height: 100%;
		max-height: 100%;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.two-columns .image-wrapper img) {
		height: auto;
		max-height: 100%;
		max-width: 100%;
		width: auto;
		display: block;
	}

	:global(.two-columns .text-wrapper) {
		font-size: 2rem;
	}

	:global(.two-columns ul) {
		padding-left: 2rem;
		margin-top: 2rem;
		display: grid;
		gap: 1rem;
	}
</style>
