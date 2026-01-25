import { faker } from '@faker-js/faker'
import type { ActorRefFrom } from 'xstate'
import type { formMachine } from '$lib/machines/formMachine'

/**
 * Generate realistic values for each field type using faker
 */
export function generateFieldValue(fieldId: string): string {
	switch (fieldId) {
		case 'name':
			return faker.person.fullName()
		case 'email':
			return faker.internet.email()
		case 'phone':
			return faker.phone.number()
		case 'address':
			return faker.location.streetAddress({ useFullAddress: true })
		default:
			return ''
	}
}

/**
 * Schedule the next remote edit, creating a chain that continues indefinitely
 */
function scheduleNextRemoteEdit(
	formActor: ActorRefFrom<typeof formMachine>,
	networkActor: { getSnapshot: () => { value: string } }
) {
	// Random delay between 1-3 seconds for more natural timing
	const delay = 1000 + Math.random() * 2000

	setTimeout(() => {
		// Check network status at the time the timeout fires
		const networkState = networkActor.getSnapshot().value as 'disconnected' | 'connecting' | 'connected'
		if (networkState !== 'connected') {
			return // Stop the chain if network is not connected
		}

		const fieldsToUpdate = ['name', 'email', 'phone', 'address']
		const randomField = fieldsToUpdate[Math.floor(Math.random() * fieldsToUpdate.length)]
		const randomValue = generateFieldValue(randomField)
		const editorName = faker.person.fullName()

		formActor.send({
			type: 'REMOTE_UPDATE',
			fieldId: randomField,
			value: randomValue,
			editedBy: editorName,
			editedAt: new Date()
		})

		// Schedule the next edit to continue the chain
		scheduleNextRemoteEdit(formActor, networkActor)
	}, delay)
}

/**
 * Setup remote edit simulation when network connects
 */
export function setupRemoteEdits(
	formActor: ActorRefFrom<typeof formMachine>,
	networkActor: { getSnapshot: () => { value: string } },
	previousNetworkState: 'disconnected' | 'connecting' | 'connected'
): 'disconnected' | 'connecting' | 'connected' {
	const currentState = networkActor.getSnapshot().value as 'disconnected' | 'connecting' | 'connected'
	if (previousNetworkState !== 'connected' && currentState === 'connected') {
		// Start the chain of remote edits
		scheduleNextRemoteEdit(formActor, networkActor)
	}
	return currentState
}
