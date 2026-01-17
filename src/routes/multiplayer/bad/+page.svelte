<script lang="ts">
	import { createActor } from 'xstate'
	import { formMachine } from '$lib/machines/formMachine'
	import { getNetworkStatusActor } from '$lib/stores/networkStatusStore'
	import { browser } from '$app/environment'
	import MultiplayerForm from '$lib/components/MultiplayerForm.svelte'
	import { setupRemoteEdits } from '$lib/utils/formUtils'

	const formActor = createActor(formMachine)
	formActor.start()
	const networkActor = getNetworkStatusActor()

	let formSnapshot = $state(formActor.getSnapshot())
	let networkSnapshot = $state(networkActor.getSnapshot())

	if (browser) {
		$effect(() => {
			const formSubscription = formActor.subscribe((newSnapshot) => {
				formSnapshot = newSnapshot
			})
			const networkSubscription = networkActor.subscribe((newSnapshot) => {
				networkSnapshot = newSnapshot
			})
			return () => {
				formSubscription.unsubscribe()
				networkSubscription.unsubscribe()
			}
		})
	}

	const fields = $derived(formSnapshot?.context.fields)

	// Simulate remote edits when going online
	let previousNetworkState = $state<'disconnected' | 'connecting' | 'connected'>('disconnected')

	$effect(() => {
		previousNetworkState = setupRemoteEdits(formActor, networkSnapshot, previousNetworkState)
	})
</script>

<h1>Multiplayer Form (Bad)</h1>
<MultiplayerForm {fields} {formActor} showEditInfo={false} />

<style>
	h1 {
		margin: 0 0 2rem 0;
		font-size: 1.5rem;
		padding: 2rem 2rem 0 2rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}
</style>
