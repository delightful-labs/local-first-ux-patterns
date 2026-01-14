import { faker } from '@faker-js/faker'

export type Message = {
	id: string
	fromSelf: boolean
	body: string
	status: 'sent' | 'error-sending'
}

export type Friend = {
	id: string
	name: string
	messages: Message[]
}

export const friends: Friend[] = Array.from({ length: 20 }, () => {
	const id = faker.string.uuid()
	const name = faker.person.fullName()

	const messages: Message[] = Array.from({ length: faker.number.int({ min: 5, max: 20 }) }, () => ({
		id: faker.string.uuid(),
		fromSelf: faker.datatype.boolean(),
		body: faker.lorem.sentence(),
		status: 'sent' as const
	}))

	return {
		id,
		name,
		messages
	}
})
