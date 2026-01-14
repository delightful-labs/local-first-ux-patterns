<script lang="ts">
	import type { Friend } from '$lib/data/friends'

	export let friends: Friend[] = []
</script>

<ul>
	{#each friends as friend}
		<li>
			<a href={`/messages/${friend.id}`}>{friend.name}</a>
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		border: 1px solid;
	}

	li {
		padding: 1rem;
	}

	li:not(:last-child) {
		border-bottom: 1px solid;
	}

	a {
		color: inherit;
		display: block;
		width: 100%;
	}

	a:hover,
	a:focus {
		text-decoration: none;
	}
</style>
