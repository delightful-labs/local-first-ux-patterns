import { createActor } from 'xstate'
import { toastMachine, type ToastContext } from '$lib/machines/toastMachine'

// Create a singleton actor for the toast machine
let toastActorInstance: ReturnType<typeof createActor<typeof toastMachine>> | null = null

function getToastActor() {
	if (!toastActorInstance) {
		toastActorInstance = createActor(toastMachine)
		toastActorInstance.start()
	}
	return toastActorInstance
}

/**
 * Add a toast notification
 */
export function addToast(toast: ToastContext) {
	const actor = getToastActor()
	actor.send({ type: 'ADD_TOAST', toast })
}

/**
 * Remove a toast notification
 */
export function removeToast(id: string) {
	const actor = getToastActor()
	actor.send({ type: 'REMOVE_TOAST', id })
}

/**
 * Dismiss a toast notification
 */
export function dismissToast(id: string) {
	const actor = getToastActor()
	actor.send({ type: 'DISMISS_TOAST', id })
}

/**
 * Clear all toast notifications
 */
export function clearAllToasts() {
	const actor = getToastActor()
	actor.send({ type: 'CLEAR_ALL' })
}

/**
 * Dismiss all toast notifications (with animation)
 */
export function dismissAllToasts() {
	const actor = getToastActor()
	const snapshot = actor.getSnapshot()
	// Dismiss each toast individually to trigger the hide animation
	for (const toastId of snapshot.context.toasts.keys()) {
		actor.send({ type: 'DISMISS_TOAST', id: toastId })
	}
}

/**
 * Get the toast machine actor (for use in components)
 */
export function getToastMachineActor() {
	return getToastActor()
}

/**
 * Helper functions for common toast types
 */
export const toast = {
	success: (message: string, duration?: number) => {
		addToast({
			id: crypto.randomUUID(),
			message,
			type: 'success',
			duration
		})
	},
	error: (message: string, duration?: number) => {
		addToast({
			id: crypto.randomUUID(),
			message,
			type: 'error',
			duration
		})
	},
	info: (message: string, duration?: number) => {
		addToast({
			id: crypto.randomUUID(),
			message,
			type: 'info',
			duration
		})
	},
	warning: (message: string, duration?: number) => {
		addToast({
			id: crypto.randomUUID(),
			message,
			type: 'warning',
			duration
		})
	}
}
