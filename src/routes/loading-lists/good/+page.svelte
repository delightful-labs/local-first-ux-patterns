<script>
	import DocumentList from '$lib/components/DocumentList.svelte'
	import { getNetworkStatusActor } from '$lib/stores/networkStatusStore'
	import { tick } from 'svelte'
	import { toast } from '$lib/stores/toastStore'
	import { faker } from '@faker-js/faker'
	import { browser } from '$app/environment'

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
		// 1. Save the current scroll position before the DOM updates
		const currentScrollTop = listElement.scrollTop
		const currentScrollHeight = listElement.scrollHeight

		// 2. Generate a random number of items (1-9)
		const newItemCount = faker.number.int({ min: 1, max: 9 })
		const newItems = generateDocuments(newItemCount)

		// 3. Prepend new items to the array
		documents = [...newItems, ...documents]

		// 4. Wait for Svelte to update the DOM
		await tick()

		// 5. Calculate the difference in scroll height (the height of the new items)
		const newScrollHeight = listElement.scrollHeight
		const addedHeight = newScrollHeight - currentScrollHeight

		// 6. Restore the scroll position relative to the new content
		listElement.scrollTop = currentScrollTop + addedHeight

		toast.success('New items loaded! Scroll up to see them.')
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

<div class="list-wrapper">
	<div bind:this={listElement}>
		<DocumentList {documents} />
	</div>
</div>

<style>
	.list-wrapper {
		box-sizing: border-box;
		height: 100svh;
		display: flex;
		flex-direction: column;
		padding: 2rem;
	}

	div {
		outline: var(--border-width) solid;
		flex: 1 auto;
		overflow-y: auto;
	}
</style>
