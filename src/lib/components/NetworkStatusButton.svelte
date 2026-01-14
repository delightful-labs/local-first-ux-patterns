<script lang="ts">
	import Button from './Button.svelte'
	import { getNetworkStatusActor } from '$lib/stores/networkStatusStore'
	import type { NetworkStatusMachineEvents } from '$lib/machines/networkStatusMachine'
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
	const isConnecting = $derived(currentState === 'connecting')
	const isConnected = $derived(currentState === 'connected')

	const handleConnect = () => {
		actor.send({ type: 'CONNECT' } satisfies NetworkStatusMachineEvents)
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
