<div class="one-column">
	<slot />
</div>

<style>
	.one-column {
		max-width: 100ch;
		margin: 0 auto;
		padding-block: 4rem;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	:global(.one-column h1) {
		font-size: 4rem;
	}

	:global(.one-column p) {
		font-size: 2.5rem;
		margin-top: 2rem;
		line-height: 1.5;
	}

	:global(.one-column h2) {
		font-size: 5rem;
		text-align: center;
	}

	:global(.one-column .subtitle) {
		font-size: 3.5rem;
		margin-top: 2rem;
		text-align: center;
	}

	:global(.one-column ul) {
		padding-left: 2rem;
		font-size: 2.5rem;
		margin-top: 4rem;
		display: grid;
		gap: 1rem;
	}
</style>
