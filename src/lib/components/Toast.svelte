<script lang="ts">
	import type { ActorRefFrom } from 'xstate'
	import type { toastChildMachine } from '$lib/machines/toastMachine'
	import { browser } from '$app/environment'

	interface Props {
		actor: ActorRefFrom<typeof toastChildMachine>
		onDismiss?: () => void
	}

	let { actor, onDismiss }: Props = $props()

	let snapshot = $state(actor.getSnapshot())

	if (browser) {
		$effect(() => {
			const unsubscribe = actor.subscribe((newSnapshot) => {
				snapshot = newSnapshot
			})
			return unsubscribe
		})
	}

	const handleDismiss = () => {
		actor.send({ type: 'DISMISS' })
		onDismiss?.()
	}

	const handleMouseEnter = () => {
		actor.send({ type: 'HOVER' })
	}

	const handleMouseLeave = () => {
		actor.send({ type: 'UNHOVER' })
	}

	const getTypeStyles = (type: string) => {
		switch (type) {
			case 'success':
				return 'toast-success'
			case 'error':
				return 'toast-error'
			case 'warning':
				return 'toast-warning'
			default:
				return 'toast-info'
		}
	}

	const currentState = $derived(snapshot?.value)
	const context = $derived(snapshot?.context)
	const isHiding = $derived(currentState === 'hiding')
	const toastClass = $derived(
		context ? `toast ${getTypeStyles(context.type)} ${isHiding ? 'hiding' : ''}` : 'toast'
	)
</script>

{#if currentState !== 'removed' && context}
	<li
		class={toastClass}
		role="alert"
		aria-live="polite"
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
	>
		<div class="toast-content">
			<span class="toast-message">{context.message}</span>
		</div>
		<button class="toast-dismiss" onclick={handleDismiss} aria-label="Dismiss"> × </button>
	</li>
{/if}

<style>
	.toast {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-width: 300px;
		max-width: 500px;
		padding: 1rem 1.5rem;
		border: var(--border-width) solid black;
		box-shadow: var(--box-shadow-3d);
		background-color: white;
		opacity: 1;
		transform: translateX(0);
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
	}

	.toast.hiding {
		opacity: 0;
		transform: translateX(100%);
	}

	.toast-info {
		border-left-color: var(--color-info);
	}

	.toast-success {
		color: white;
		background-color: var(--color-success);
	}

	.toast-error {
		border-left-color: var(--color-error);
	}

	.toast-warning {
		border-left-color: var(--color-warning);
	}

	.toast-content {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.toast-dismiss {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.5rem;
		line-height: 1;
		color: inherit;
		padding: 0;
		margin-left: 0.75rem;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.25rem;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	.toast-dismiss:hover {
		background-color: #f3f4f6;
		color: #1f2937;
	}

	.toast-dismiss:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}
</style>
