<script>
	import DocumentList from '$lib/components/DocumentList.svelte'
	import { getNetworkStatusActor } from '$lib/stores/networkStatusStore'
	import { toast } from '$lib/stores/toastStore'
	import { faker } from '@faker-js/faker'
	import { browser } from '$app/environment'
	import DocumentListWrapper from '$lib/components/DocumentListWrapper.svelte'

	/**
	 * @type {HTMLDivElement}
	 */
	let listElement

	/**
	 * @param {number} count
	 */
	function generateDocuments(count) {
		return Array.from({ length: count }, () => ({
			title: faker.lorem.sentence({ min: 1, max: 3 }),
			description: faker.lorem.sentence({ min: 7, max: 20 })
		}))
	}

	let documents = $state(generateDocuments(12))

	const addItems = async () => {
		// Generate a random number of items (1-9)
		const newItemCount = faker.number.int({ min: 1, max: 9 })
		const newItems = generateDocuments(newItemCount)

		// Prepend new items to the array
		// BAD: This will push everything down without preserving scroll position
		documents = [...newItems, ...documents]

		toast.success('New items loaded!')
	}

	// Subscribe to network status and add items when connected
	if (browser) {
		const actor = getNetworkStatusActor()
		let previousState = $state(actor.getSnapshot().value)

		$effect(() => {
			const subscription = actor.subscribe((snapshot) => {
				const currentState = snapshot.value
				// Trigger addItems when transitioning to connected state
				if (previousState !== 'connected' && currentState === 'connected') {
					addItems()
				}
				previousState = currentState
			})
			return () => subscription.unsubscribe()
		})
	}
</script>

<DocumentListWrapper>
	<div bind:this={listElement} slot="list">
		<DocumentList {documents} />
	</div>
</DocumentListWrapper>

<style>
	div {
		border-left: var(--border-width) solid;
		flex: 1 auto;
		overflow-y: auto;
	}
</style>
