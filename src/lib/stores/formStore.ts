import { createActor } from 'xstate'
import { formMachine } from '$lib/machines/formMachine'

// Create a singleton actor for the form machine
let formActorInstance: ReturnType<typeof createActor<typeof formMachine>> | null = null

/**
 * Get the form machine actor (for use in components)
 */
export function getFormActor() {
	if (!formActorInstance) {
		formActorInstance = createActor(formMachine)
		formActorInstance.start()
	}
	return formActorInstance
}
