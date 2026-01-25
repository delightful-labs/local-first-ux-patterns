import { setup, assign } from 'xstate'
import { faker } from '@faker-js/faker'

export type SyncStatus = 'synced' | 'syncing' | 'pending'

export interface Document {
	id: string
	title: string
	body: string
	syncStatus: SyncStatus
}

export interface SyncingFilesMachineContext {
	documents: Document[]
}

export type SyncingFilesMachineEvents =
	| { type: 'GO_ONLINE' }
	| { type: 'GO_OFFLINE' }
	| { type: 'DOCUMENT_SYNCED'; documentId: string }
	| { type: 'START_SYNCING' }
	| { type: 'RESET' }

// Generate initial documents with faker - mix of synced and pending
function generateDocuments(count: number): Document[] {
	return Array.from({ length: count }, (_, index) => {
		// First item is always unsynced (pending), then alternate
		let syncStatus: SyncStatus
		if (index === 0) {
			syncStatus = 'pending'
		} else {
			syncStatus = index % 2 === 0 ? 'pending' : 'synced'
		}
		return {
			id: faker.string.uuid(),
			title: faker.lorem.sentence({ min: 1, max: 4 }),
			body: faker.lorem.paragraphs({ min: 2, max: 5 }),
			syncStatus
		}
	})
}

export const syncingFilesMachine = setup({
	types: {
		context: {} as SyncingFilesMachineContext,
		events: {} as SyncingFilesMachineEvents
	}
}).createMachine({
	id: 'syncingFiles',
	initial: 'offline',
	context: {
		documents: generateDocuments(8)
	},
	states: {
		offline: {
			on: {
				GO_ONLINE: {
					target: 'syncing',
					actions: assign({
						documents: ({ context }) =>
							context.documents.map((doc) =>
								doc.syncStatus === 'pending' ? { ...doc, syncStatus: 'syncing' as SyncStatus } : doc
							)
					})
				},
				RESET: {
					target: 'offline',
					actions: assign({
						documents: () => generateDocuments(8)
					})
				}
			}
		},
		syncing: {
			on: {
				DOCUMENT_SYNCED: {
					actions: assign({
						documents: ({ context, event }) =>
							context.documents.map((doc) =>
								doc.id === event.documentId ? { ...doc, syncStatus: 'synced' as SyncStatus } : doc
							)
					})
				},
				GO_OFFLINE: {
					target: 'offline',
					actions: assign({
						documents: ({ context }) =>
							context.documents.map((doc) =>
								doc.syncStatus === 'syncing' ? { ...doc, syncStatus: 'pending' as SyncStatus } : doc
							)
					})
				},
				RESET: {
					target: 'offline',
					actions: assign({
						documents: () => generateDocuments(8)
					})
				}
			},
			always: {
				guard: ({ context }) => context.documents.every((doc) => doc.syncStatus === 'synced'),
				target: 'online'
			}
		},
		online: {
			on: {
				GO_OFFLINE: {
					target: 'offline'
				},
				RESET: {
					target: 'offline',
					actions: assign({
						documents: () => generateDocuments(8)
					})
				}
			}
		}
	}
})
