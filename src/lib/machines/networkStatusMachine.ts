import { setup } from 'xstate'

export type NetworkStatusMachineEvents = { type: 'CONNECT' } | { type: 'DISCONNECT' }

export interface NetworkStatusMachineContext {
	// Empty context for now, but could be extended with connection details
}

export const networkStatusMachine = setup({
	types: {
		context: {} as NetworkStatusMachineContext,
		events: {} as NetworkStatusMachineEvents
	}
}).createMachine({
	id: 'networkStatus',
	initial: 'disconnected',
	context: {},
	states: {
		disconnected: {
			on: {
				CONNECT: {
					target: 'connecting'
				}
			}
		},
		connecting: {
			after: {
				3000: {
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
