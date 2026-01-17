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
 * Setup remote edit simulation when network connects
 */
export function setupRemoteEdits(
	formActor: ActorRefFrom<typeof formMachine>,
	networkSnapshot: { value: string } | null,
	previousNetworkState: 'disconnected' | 'connecting' | 'connected'
): 'disconnected' | 'connecting' | 'connected' {
	const currentState = networkSnapshot?.value as 'disconnected' | 'connecting' | 'connected'
	if (previousNetworkState !== 'connected' && currentState === 'connected') {
		// Simulate another user editing fields after a short delay
		setTimeout(() => {
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
		}, 1000)

		// Update another field after a longer delay
		setTimeout(() => {
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
		}, 3000)
	}
	return currentState
}
