import { setup, assign } from 'xstate'

export type NetworkStatusMachineEvents =
	| { type: 'CONNECT'; delay?: number }
	| { type: 'DISCONNECT' }

export interface NetworkStatusMachineContext {
	connectionDelay: number
}

export const networkStatusMachine = setup({
	types: {
		context: {} as NetworkStatusMachineContext,
		events: {} as NetworkStatusMachineEvents
	},
	delays: {
		connectionDelay: ({ context }) => context.connectionDelay
	}
}).createMachine({
	id: 'networkStatus',
	initial: 'disconnected',
	context: {
		connectionDelay: 500 // Default delay of 500ms
	},
	states: {
		disconnected: {
			on: {
				CONNECT: {
					target: 'connecting',
					actions: assign({
						connectionDelay: ({ event }) => event.delay ?? 800
					})
				}
			}
		},
		connecting: {
			after: {
				connectionDelay: {
					target: 'connected'
				}
			},
			on: {
				DISCONNECT: {
					target: 'disconnected'
				}
			}
		},
		connected: {
			on: {
				DISCONNECT: {
					target: 'disconnected'
				}
			}
		}
	}
})
