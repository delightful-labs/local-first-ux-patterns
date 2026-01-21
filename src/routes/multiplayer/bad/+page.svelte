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

<MultiplayerForm {fields} {formActor} showEditInfo={false} />
