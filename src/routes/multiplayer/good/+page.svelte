<script lang="ts">
	import { createActor } from 'xstate'
	import { formMachine } from '$lib/machines/formMachine'
	import { getNetworkStatusActor } from '$lib/stores/networkStatusStore'
	import { browser } from '$app/environment'
	import MultiplayerForm from '$lib/components/MultiplayerForm.svelte'
	import { setupRemoteEdits } from '$lib/utils/formUtils'
	import { faker } from '@faker-js/faker'

	const formActor = createActor(formMachine, {
		input: {
			initialFields: [
				{ id: 'name', label: 'Name', value: faker.person.fullName() },
				{ id: 'email', label: 'Email', value: faker.internet.email() },
				{ id: 'phone', label: 'Phone', value: faker.phone.number() },
				{
					id: 'address',
					label: 'Address',
					value: faker.location.streetAddress({ useFullAddress: true })
				}
			]
		}
	})
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
		// Track networkSnapshot to ensure effect re-runs when network state changes
		const currentNetworkSnapshot = networkSnapshot
		previousNetworkState = setupRemoteEdits(formActor, networkActor, previousNetworkState)
	})
</script>

<MultiplayerForm {fields} {formActor} showEditInfo={true} showHistory={true} />
