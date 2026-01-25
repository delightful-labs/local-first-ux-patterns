<script lang="ts">
	import Button from './Button.svelte'
	import { getNetworkStatusActor } from '$lib/stores/networkStatusStore'
	import type { NetworkStatusMachineEvents } from '$lib/machines/networkStatusMachine'
	import { browser } from '$app/environment'
	import { page } from '$app/stores'

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
	const isConnecting = $derived(currentState === 'connecting')
	const isConnected = $derived(currentState === 'connected')

	const handleConnect = () => {
		// Use 3000ms delay for loading-lists pages, default 800ms for others
		const currentPath = $page.url.pathname
		const delay = currentPath.startsWith('/loading-lists/') ? 3000 : undefined
		actor.send({ type: 'CONNECT', delay } satisfies NetworkStatusMachineEvents)
	}

	const handleDisconnect = () => {
		actor.send({ type: 'DISCONNECT' } satisfies NetworkStatusMachineEvents)
	}
</script>

<Button
	onclick={isConnected ? handleDisconnect : handleConnect}
	disabled={isConnecting}
	aria-label={isConnected ? 'Disconnect' : 'Connect'}
>
	{isConnected ? 'Disconnect' : 'Connect'}
</Button>
