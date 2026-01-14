<script lang="ts">
	import { getNetworkStatusActor } from '$lib/stores/networkStatusStore'
	import { browser } from '$app/environment'

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

	const getStateLabel = () => {
		switch (currentState) {
			case 'disconnected':
				return 'Disconnected'
			case 'connecting':
				return 'Connecting...'
			case 'connected':
				return 'Connected'
			default:
				return 'Unknown'
		}
	}

	const getStateColor = () => {
		switch (currentState) {
			case 'disconnected':
				return 'var(--color-error)'
			case 'connecting':
				return 'var(--color-warning)'
			case 'connected':
				return 'var(--color-success)'
			default:
				return 'gray'
		}
	}
</script>

<div class="status-indicator">
	<span
		class="status-dot"
		style="background-color: {getStateColor()}"
		aria-label="Network status: {getStateLabel()}"
	></span>
	<span class="status-label">{getStateLabel()}</span>
</div>

<style>
	.status-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.status-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		display: inline-block;
		box-shadow: 0 0 0 2px rgba(0, 0, 0);
		border: 2px solid white;
	}

	.status-label {
		font-weight: 500;
	}
</style>
