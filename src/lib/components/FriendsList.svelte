<script lang="ts">
	import type { Friend } from '$lib/data/friends'
	import { friends } from '$lib/stores/friendsStore'

	const hasFailedMessages = (friend: Friend) => {
		return friend.messages.some((msg) => msg.status === 'error-sending' && msg.fromSelf)
	}
</script>

<ul>
	{#each $friends as friend}
		<li>
			<a href={`/messages/${friend.id}`}>
				<span>{friend.name}</span>
				{#if hasFailedMessages(friend)}
					<svg
						class="error-icon"
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-label="Failed messages"
					>
						<circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
						<path
							d="M8 4v4M8 10h.01"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
				{/if}
			</a>
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
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		width: 100%;
	}

	a:hover,
	a:focus {
		text-decoration: none;
	}

	.error-icon {
		flex-shrink: 0;
		color: var(--color-error, #dc2626);
	}
</style>
