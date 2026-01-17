<script lang="ts">
	import type { Friend } from '$lib/data/friends'
	import { getNetworkStatusActor } from '$lib/stores/networkStatusStore'
	import { friends } from '$lib/stores/friendsStore'
	import { browser } from '$app/environment'
	import Button from './Button.svelte'
	import WarningIcon from './WarningIcon.svelte'

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
	let messagesListRef: HTMLUListElement | null = $state(null)

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

	// Auto-scroll to bottom when messages change or friend changes
	$effect(() => {
		if (messagesListRef && friendStore.messages) {
			// Use requestAnimationFrame to ensure DOM is updated
			requestAnimationFrame(() => {
				if (messagesListRef) {
					messagesListRef.scrollTop = messagesListRef.scrollHeight
				}
			})
		}
	})

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	const dialogRefs = $state(new Map<string, HTMLDialogElement>())

	const registerDialog = (node: HTMLDialogElement, messageId: string) => {
		dialogRefs.set(messageId, node)
		return {
			destroy() {
				dialogRefs.delete(messageId)
			}
		}
	}

	const handleRetry = (messageId: string) => {
		const status = isDisconnected ? 'error-sending' : 'sent'
		friends.update((friendsList) => {
			return friendsList.map((f) => {
				if (f.id === friend.id) {
					return {
						...f,
						messages: f.messages.map((msg) => {
							if (msg.id === messageId) {
								return { ...msg, status }
							}
							return msg
						})
					}
				}
				return f
			})
		})
		const dialog = dialogRefs.get(messageId)
		dialog?.close()
	}

	const showDialog = (messageId: string) => {
		const dialog = dialogRefs.get(messageId)
		dialog?.showModal()
	}

	const handleDialogClick = (e: MouseEvent, messageId: string) => {
		// Close dialog if clicking on the backdrop (the dialog element itself)
		if (e.target === e.currentTarget) {
			const dialog = dialogRefs.get(messageId)
			dialog?.close()
		}
	}
</script>

<section class="messages">
	<header class="messages-header">
		<h2>{friendStore.name}</h2>
	</header>

	<ul bind:this={messagesListRef}>
		{#each friendStore.messages as message (message.id)}
			<li class:from-self={message.fromSelf} class:from-friend={!message.fromSelf}>
				<span class="message-body">{message.body}</span>
				{#if message.status === 'error-sending'}
					<button
						class="error-icon-button"
						onclick={() => showDialog(message.id)}
						aria-label="Failed to send - click to retry"
					>
						<WarningIcon class="error-icon" />
					</button>
					<dialog
						use:registerDialog={message.id}
						class="retry-dialog"
						onclick={(e) => handleDialogClick(e, message.id)}
					>
						<p>Message failed to send</p>
						<Button onclick={() => handleRetry(message.id)}>Retry</Button>
					</dialog>
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
	}

	.messages-header {
		padding: 1rem;
		border-bottom: var(--border-width) solid;
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

	.error-icon-button {
		flex-shrink: 0;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.error-icon) {
		color: var(--color-error, #dc2626);
	}

	.from-self :global(.error-icon) {
		color: #ff6b6b;
	}

	.retry-dialog {
		padding: 1rem;
		background: white;
		border: var(--border-width) solid black;
		border-radius: 0.25rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		min-width: 200px;
	}

	.retry-dialog p {
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
	}

	.retry-dialog::backdrop {
		background: rgba(0, 0, 0, 0.1);
	}

	.message-input {
		padding: 1rem;
		border-top: var(--border-width) solid;
		display: flex;
		gap: 0.5rem;
		align-items: start;
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
