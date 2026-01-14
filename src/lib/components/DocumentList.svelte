<script>
	/**
	 * @type {Array<{title: string, description: string}>}
	 */
	export let documents = []
</script>

<ul>
	{#each documents as document}
		<li>
			<h3>{document.title}</h3>
			<p>{document.description}</p>
		</li>
	{/each}
</ul>

<style>
	ul {
		padding: 0;
		margin: 0;
	}

	li {
		padding: 2rem;
		border-bottom: var(--border-width) solid;
		list-style: none;

		p {
			font-family: 'FlowBlock';
		}
	}

	li:last-child {
		border-bottom: 0;
	}
</style>
