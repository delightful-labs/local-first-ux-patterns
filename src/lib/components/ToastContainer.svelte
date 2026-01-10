<script lang="ts">
	import { getToastMachineActor } from '$lib/stores/toastStore'
	import Toast from './Toast.svelte'

	const actor = getToastMachineActor()
	let snapshot = $state(actor.getSnapshot())

	$effect(() => {
		const unsubscribe = actor.subscribe((newSnapshot) => {
			snapshot = newSnapshot
		})
		return unsubscribe
	})

	const toasts = $derived(snapshot?.context ? Array.from(snapshot.context.toasts.entries()) : [])
</script>

<ul class="toast-container" aria-live="polite">
	{#each toasts as [id, toastActor]}
		<Toast actor={toastActor} />
	{/each}
</ul>

<style>
	.toast-container {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		pointer-events: none;
		gap: 0.5rem;
	}

	.toast-container :global(.toast) {
		pointer-events: auto;
	}
</style>
