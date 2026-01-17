<script lang="ts">
	import { friends } from '$lib/stores/friendsStore'
	import { getNetworkStatusActor } from '$lib/stores/networkStatusStore'
	import type { Friend } from '$lib/data/friends'
	import { browser } from '$app/environment'
	import { get } from 'svelte/store'
	import { slide } from 'svelte/transition'
	import Button from './Button.svelte'
	import WarningIcon from './WarningIcon.svelte'

	const actor = getNetworkStatusActor()
	let snapshot = $state(actor.getSnapshot())

	if (browser) {
		$effect(() => {
			const subscription = actor.subscribe((newSnapshot) => {
				snapshot = newSnapshot
			})
			return () => subscription.unsubscribe()
		})
	}

	const currentState = $derived(snapshot?.value as 'disconnected' | 'connecting' | 'connected')
	const isConnected = $derived(currentState === 'connected')

	// Get all failed messages from all friends
	let friendsList = $state<Friend[]>(get(friends))
	
	$effect(() => {
		const unsubscribe = friends.subscribe((list) => {
			friendsList = list
		})
		return unsubscribe
	})

	const failedMessages = $derived(
		friendsList.flatMap((friend) =>
			friend.messages
				.filter((msg) => msg.status === 'error-sending' && msg.fromSelf)
				.map((message) => ({ friend, message }))
		)
	)

	const hasFailedMessages = $derived(failedMessages.length > 0)

	const handleRetryAll = async () => {
		if (!isConnected) return

		// Create a copy of failed messages to process
		const messagesToRetry = [...failedMessages]
		
		// Process messages one at a time with a delay
		for (let i = 0; i < messagesToRetry.length; i++) {
			const { friend, message } = messagesToRetry[i]
			
			// Update this specific message
			friends.update((friendsList) => {
				return friendsList.map((f) => {
					if (f.id === friend.id) {
						return {
							...f,
							messages: f.messages.map((msg) => {
								if (msg.id === message.id && msg.status === 'error-sending') {
									return { ...msg, status: 'sent' as const }
								}
								return msg
							})
						}
					}
					return f
				})
			})
			
			// Wait before processing the next message (except for the last one)
			if (i < messagesToRetry.length - 1) {
				await new Promise((resolve) => setTimeout(resolve, 300))
			}
		}
	}
</script>

{#if hasFailedMessages}
	<div class="outbox" transition:slide={{ duration: 300 }}>
		<header class="outbox-header">
			<div class="outbox-title">
				<WarningIcon class="error-icon" />
				<span>Outbox</span>
				<span class="count">({failedMessages.length})</span>
			</div>
			<Button onclick={handleRetryAll} disabled={!isConnected}>
				Retry All
			</Button>
		</header>
		<ul class="outbox-messages">
			{#each failedMessages as { friend, message }}
				<li>
					<span class="friend-name">{friend.name}:</span>
					<span class="message-body">{message.body}</span>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.outbox {
		border-bottom: var(--border-width) solid;
		background-color: #fff3cd;
	}

	.outbox-header {
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.outbox-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
	}

	.count {
		font-weight: normal;
		opacity: 0.7;
	}

	:global(.error-icon) {
		color: var(--color-error, #dc2626);
		flex-shrink: 0;
	}

	.outbox-messages {
		list-style: none;
		margin: 0;
		padding: 0 1rem 1rem 1rem;
		display: grid;
		gap: 0.5rem;
		max-height: 200px;
		overflow-y: auto;
	}

	.outbox-messages li {
		padding: 0.5rem;
		background-color: white;
		border: var(--border-width) solid rgba(0, 0, 0, 0.1);
		border-radius: 0.25rem;
		display: flex;
		gap: 0.5rem;
		font-size: 0.875rem;
	}

	.friend-name {
		font-weight: 600;
		flex-shrink: 0;
	}

	.message-body {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
