<script lang="ts">
	import type { Friend } from '$lib/data/friends'
	import { friends } from '$lib/stores/friendsStore'
	import { page } from '$app/stores'
	import WarningIcon from './WarningIcon.svelte'

	const hasFailedMessages = (friend: Friend) => {
		return friend.messages.some((msg) => msg.status === 'error-sending' && msg.fromSelf)
	}

	const getFriendLink = (friendId: string) => {
		const currentPath = $page.url.pathname
		// Get the base path (either /messages/bad or /messages/good)
		// Remove the friendId if present (path like /messages/bad/someId -> /messages/bad)
		const basePath = currentPath.match(/^\/messages\/(bad|good)/)?.[0] || '/messages/bad'
		return `${basePath}/${friendId}`
	}
</script>

<ul>
	{#each $friends as friend}
		<li>
			<a href={getFriendLink(friend.id)}>
				<span>{friend.name}</span>
				{#if hasFailedMessages(friend)}
					<WarningIcon class="error-icon" aria-label="Failed messages" />
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
		overflow-y: auto;
		height: 100%;
	}

	li {
		padding: 1rem;
	}

	li:not(:last-child) {
		border-bottom: var(--border-width) solid;
	}

	a {
		color: inherit;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		width: 100%;
		font-weight: 700;
	}

	a:hover,
	a:focus {
		text-decoration: none;
	}

	:global(.error-icon) {
		flex-shrink: 0;
		color: var(--color-error, #dc2626);
	}
</style>
