import { setup, assign } from 'xstate'
import { faker } from '@faker-js/faker'

export interface FieldHistoryEntry {
	value: string
	editedBy: string
	editedAt: Date
}

export interface FormField {
	id: string
	label: string
	value: string
	lastEditedBy?: string
	lastEditedAt?: Date
	history?: FieldHistoryEntry[]
}

export interface FormMachineContext {
	fields: FormField[]
	currentUser: string
}

export type FormMachineEvents =
	| { type: 'UPDATE_FIELD'; fieldId: string; value: string }
	| { type: 'REMOTE_UPDATE'; fieldId: string; value: string; editedBy: string; editedAt: Date }
	| { type: 'REVERT_FIELD'; fieldId: string; historyIndex: number }

export const formMachine = setup({
	types: {
		context: {} as FormMachineContext,
		events: {} as FormMachineEvents
	}
}).createMachine({
	id: 'form',
	initial: 'editing',
	context: {
		fields: [
			{ id: 'name', label: 'Name', value: faker.person.fullName() },
			{ id: 'email', label: 'Email', value: faker.internet.email() },
			{ id: 'phone', label: 'Phone', value: faker.phone.number() },
			{
				id: 'address',
				label: 'Address',
				value: faker.location.streetAddress({ useFullAddress: true })
			}
		],
		currentUser: 'You'
	},
	states: {
		editing: {
			on: {
				UPDATE_FIELD: {
					actions: assign({
						fields: ({ context, event }) => {
							return context.fields.map((field) => {
								if (field.id === event.fieldId) {
									const history = field.history || []
									// Add current value to history if it exists and is different
									if (field.value && field.value !== event.value) {
										history.push({
											value: field.value,
											editedBy: field.lastEditedBy || context.currentUser,
											editedAt: field.lastEditedAt || new Date()
										})
									}
									return {
										...field,
										value: event.value,
										lastEditedBy: context.currentUser,
										lastEditedAt: new Date(),
										history
									}
								}
								return field
							})
						}
					})
				},
				REMOTE_UPDATE: {
					actions: assign({
						fields: ({ context, event }) => {
							return context.fields.map((field) => {
								if (field.id === event.fieldId) {
									const history = field.history || []
									// Add current value to history if it exists and is different
									if (field.value && field.value !== event.value) {
										history.push({
											value: field.value,
											editedBy: field.lastEditedBy || context.currentUser,
											editedAt: field.lastEditedAt || new Date()
										})
									}
									return {
										...field,
										value: event.value,
										lastEditedBy: event.editedBy,
										lastEditedAt: event.editedAt,
										history
									}
								}
								return field
							})
						}
					})
				},
				REVERT_FIELD: {
					actions: assign({
						fields: ({ context, event }) => {
							return context.fields.map((field) => {
								if (field.id === event.fieldId && field.history) {
									const history = [...field.history]
									const entryToRevert = history[event.historyIndex]
									if (entryToRevert) {
										// Add current value to history before reverting
										history.push({
											value: field.value,
											editedBy: field.lastEditedBy || context.currentUser,
											editedAt: field.lastEditedAt || new Date()
										})
										// Remove the entry we're reverting to from history
										history.splice(event.historyIndex, 1)
										return {
											...field,
											value: entryToRevert.value,
											lastEditedBy: entryToRevert.editedBy,
											lastEditedAt: entryToRevert.editedAt,
											history
										}
									}
								}
								return field
							})
						}
					})
				}
			}
		}
	}
})
