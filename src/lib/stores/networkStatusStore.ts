import { createActor } from 'xstate'
import { networkStatusMachine } from '$lib/machines/networkStatusMachine'

// Create a singleton actor for the network status machine
let networkStatusActorInstance: ReturnType<typeof createActor<typeof networkStatusMachine>> | null =
	null

/**
 * Get the network status machine actor (for use in components)
 */
export function getNetworkStatusActor() {
	if (!networkStatusActorInstance) {
		networkStatusActorInstance = createActor(networkStatusMachine)
		networkStatusActorInstance.start()
	}
	return networkStatusActorInstance
}
