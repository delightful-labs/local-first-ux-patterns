<script lang="ts">
	import type { Friend } from '$lib/data/friends'
	import { getNetworkStatusActor } from '$lib/stores/networkStatusStore'
	import { friends } from '$lib/stores/friendsStore'
	import { browser } from '$app/environment'
	import Button from './Button.svelte'

	let { friend }: { friend: Friend } = $props()

	const actor = getNetworkStatusActor()
	let snapshot = $state(actor.getSnapshot())
	let messageText = $state('')

	if (browser) {
		$effect(() => {
			const subscription = actor.subscribe((newSnapshot) => {
				snapshot = newSnapshot
			})
			return () => subscription.unsubscribe()
		})
	}

	const currentState = $derived(snapshot?.value as 'disconnected' | 'connecting' | 'connected')
	const isDisconnected = $derived(currentState === 'disconnected')

	const handleSend = () => {
		if (!messageText.trim()) return

		const status = isDisconnected ? 'error-sending' : 'sent'

		friends.update((friendsList) => {
			return friendsList.map((f) => {
				if (f.id === friend.id) {
					return {
						...f,
						messages: [
							...f.messages,
							{
								id: crypto.randomUUID(),
								fromSelf: true,
								body: messageText.trim(),
								status
							}
						]
					}
				}
				return f
			})
		})

		messageText = ''
	}

	// Subscribe to friends store to update friend when messages change
	let friendStore = $state(friend)

	// Update when friend prop changes (navigation)
	$effect(() => {
		friendStore = friend
	})

	// Update when store changes (new messages)
	$effect(() => {
		const unsubscribe = friends.subscribe((friendsList) => {
			const updatedFriend = friendsList.find((f) => f.id === friend.id)
			if (updatedFriend) {
				friendStore = updatedFriend
			}
		})
		return unsubscribe
	})

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}
</script>

<section class="messages">
	<header class="messages-header">
		<h2>{friendStore.name}</h2>
	</header>

	<ul>
		{#each friendStore.messages as message (message.id)}
			<li class:from-self={message.fromSelf} class:from-friend={!message.fromSelf}>
				<span class="message-body">{message.body}</span>
				{#if message.status === 'error-sending'}
					<svg
						class="error-icon"
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-label="Failed to send"
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
			</li>
		{/each}
	</ul>

	<div class="message-input">
		<textarea
			bind:value={messageText}
			onkeydown={handleKeyDown}
			placeholder="Type a message..."
			rows="2"
		></textarea>
		<Button onclick={handleSend} disabled={!messageText.trim()}>Send</Button>
	</div>
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
		flex: 1;
		overflow-y: auto;
	}

	li {
		padding: 0.75rem 1rem;
		max-width: 40ch;
		border-radius: 999px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.message-body {
		flex: 1;
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

	.error-icon {
		flex-shrink: 0;
		color: var(--color-error, #dc2626);
	}

	.from-self .error-icon {
		color: #ff6b6b;
	}

	.message-input {
		padding: 1rem;
		border-top: 1px solid;
		display: flex;
		gap: 0.5rem;
		align-items: flex-end;
	}

	.message-input textarea {
		flex: 1;
		font: inherit;
		padding: 0.5rem;
		border: var(--border-width) solid black;
		border-radius: 0;
		resize: vertical;
		min-height: 2.5rem;
		max-height: 8rem;
	}

	.message-input textarea:focus {
		outline: 2px solid #4a90e2;
		outline-offset: 2px;
	}
</style>
