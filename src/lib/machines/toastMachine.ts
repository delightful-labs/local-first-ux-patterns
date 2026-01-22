import { setup, assign, fromPromise, raise } from 'xstate'
import type { ActorRefFrom } from 'xstate'

// Types
export interface ToastContext {
	id: string
	message: string
	type?: 'success' | 'error' | 'info' | 'warning'
	duration?: number
}

export interface ToastMachineContext {
	toasts: Map<string, ActorRefFrom<typeof toastChildMachine>>
}

export type ToastMachineEvents =
	| { type: 'ADD_TOAST'; toast: ToastContext }
	| { type: 'REMOVE_TOAST'; id: string }
	| { type: 'DISMISS_TOAST'; id: string }
	| { type: 'CHILD_STOPPED'; id: string }
	| { type: 'CLEAR_ALL' }

// Child machine for individual toast
export const toastChildMachine = setup({
	types: {
		context: {} as ToastContext,
		input: {} as ToastContext,
		events: {} as
			| { type: 'DISMISS' }
			| { type: 'TIMEOUT' }
			| { type: 'HOVER' }
			| { type: 'UNHOVER' }
	},
	actors: {
		toastTimer: fromPromise(async ({ input }: { input: number }) => {
			await new Promise((resolve) => setTimeout(resolve, input))
			return { done: true }
		})
	}
}).createMachine({
	id: 'toastChild',
	initial: 'visible',
	context: ({ input }) => ({
		id: input.id,
		message: input.message,
		type: input.type ?? 'info',
		duration: input.duration ?? 6000
	}),
	states: {
		visible: {
			initial: 'running',
			states: {
				running: {
					invoke: {
						id: 'toastTimer',
						src: 'toastTimer',
						input: ({ context }) => context.duration ?? 5000,
						onDone: {
							actions: raise({ type: 'TIMEOUT' })
						}
					},
					on: {
						HOVER: {
							target: 'paused'
						},
						TIMEOUT: {
							target: '#toastChild.hiding'
						}
					}
				},
				paused: {
					on: {
						UNHOVER: {
							target: 'running'
						}
					}
				}
			},
			on: {
				DISMISS: {
					target: 'hiding'
				}
			}
		},
		hiding: {
			after: {
				300: {
					target: 'removed'
				}
			}
		},
		removed: {
			type: 'final'
		}
	}
})

// Parent machine that manages multiple toasts
export const toastMachine = setup({
	types: {
		context: {} as ToastMachineContext,
		events: {} as ToastMachineEvents
	},
	actors: {
		toastChild: toastChildMachine
	}
}).createMachine({
	id: 'toastManager',
	initial: 'active',
	context: {
		toasts: new Map()
	},
	states: {
		active: {
			on: {
				ADD_TOAST: {
					actions: [
						assign({
							toasts: ({ context, event, spawn, self }) => {
								const newToasts = new Map(context.toasts)
								const toastActor = spawn('toastChild', {
									id: `toast-${event.toast.id}`,
									input: event.toast
								})

								// Subscribe to the child machine to detect when it stops
								toastActor.subscribe((state) => {
									if (state.status === 'stopped') {
										// Notify parent that child has stopped
										self.send({ type: 'CHILD_STOPPED', id: event.toast.id })
									}
								})

								newToasts.set(event.toast.id, toastActor)
								return newToasts
							}
						})
					]
				},
				CHILD_STOPPED: {
					actions: assign({
						toasts: ({ context, event }) => {
							const newToasts = new Map(context.toasts)
							newToasts.delete(event.id)
							return newToasts
						}
					})
				},
				REMOVE_TOAST: {
					actions: assign({
						toasts: ({ context, event }) => {
							const newToasts = new Map(context.toasts)
							const toastActor = newToasts.get(event.id)
							if (toastActor) {
								toastActor.stop()
								newToasts.delete(event.id)
							}
							return newToasts
						}
					})
				},
				DISMISS_TOAST: {
					actions: ({ context, event }) => {
						const toastActor = context.toasts.get(event.id)
						if (toastActor) {
							toastActor.send({ type: 'DISMISS' })
						}
					}
				},
				CLEAR_ALL: {
					actions: assign({
						toasts: ({ context }) => {
							// Stop all toast actors
							for (const toastActor of context.toasts.values()) {
								toastActor.stop()
							}
							// Return empty map
							return new Map()
						}
					})
				}
			}
		}
	}
})
