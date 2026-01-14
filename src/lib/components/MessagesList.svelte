<script lang="ts">
	import type { Friend } from '$lib/data/friends'

	export let friend: Friend
</script>

<section class="messages">
	<header class="messages-header">
		<h2>{friend.name}</h2>
	</header>

	<ul>
		{#each friend.messages as message (message.id)}
			<li class:from-self={message.fromSelf} class:from-friend={!message.fromSelf}>
				{message.body}
			</li>
		{/each}
	</ul>
</section>

<style>
	.messages {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		border-left: 1px solid;
	}

	.messages-header {
		padding: 1rem;
		border-bottom: 1px solid;
	}

	h2 {
		margin: 0;
		font-size: 1.1rem;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 1rem;
		display: grid;
		gap: 1rem;
	}

	li {
		padding: 0.75rem 1rem;
		max-width: 40ch;
		border-radius: 999px;
	}

	.from-self {
		justify-self: end;
		background-color: black;
		color: white;
	}

	.from-friend {
		justify-self: start;
		background-color: #eee;
		color: #111;
	}
</style>
