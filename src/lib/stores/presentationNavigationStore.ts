import { createActor } from 'xstate'
import { presentationNavigationMachine } from '$lib/machines/presentationNavigationMachine'

// Create a singleton actor for the presentation navigation machine
let navigationActorInstance: ReturnType<
	typeof createActor<typeof presentationNavigationMachine>
> | null = null

/**
 * Get the presentation navigation machine actor (for use in components)
 */
export function getPresentationNavigationActor() {
	if (!navigationActorInstance) {
		navigationActorInstance = createActor(presentationNavigationMachine)
		navigationActorInstance.start()
	}
	return navigationActorInstance
}
