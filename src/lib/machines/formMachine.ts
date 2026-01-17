import { setup, assign } from 'xstate'
import { faker } from '@faker-js/faker'

export interface FormField {
	id: string
	label: string
	value: string
	lastEditedBy?: string
	lastEditedAt?: Date
}

export interface FormMachineContext {
	fields: FormField[]
	currentUser: string
}

export type FormMachineEvents =
	| { type: 'UPDATE_FIELD'; fieldId: string; value: string }
	| { type: 'REMOTE_UPDATE'; fieldId: string; value: string; editedBy: string; editedAt: Date }

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
							return context.fields.map((field) =>
								field.id === event.fieldId
									? {
											...field,
											value: event.value,
											lastEditedBy: context.currentUser,
											lastEditedAt: new Date()
										}
									: field
							)
						}
					})
				},
				REMOTE_UPDATE: {
					actions: assign({
						fields: ({ context, event }) => {
							return context.fields.map((field) =>
								field.id === event.fieldId
									? {
											...field,
											value: event.value,
											lastEditedBy: event.editedBy,
											lastEditedAt: event.editedAt
										}
									: field
							)
						}
					})
				}
			}
		}
	}
})
