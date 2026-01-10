<script>
	import { tick } from 'svelte'
	import { toast } from '$lib/stores/toastStore'
	import { faker } from '@faker-js/faker'

	/**
	 * @type {HTMLUListElement}
	 */
	let listElement

	function generateTransactions(count) {
		return Array.from({ length: count }, () => faker.commerce.productName())
	}

	let transactions = $state(generateTransactions(12))

	const addItems = async () => {
		// 1. Save the current scroll position before the DOM updates
		const currentScrollTop = listElement.scrollTop
		const currentScrollHeight = listElement.scrollHeight

		// 2. Generate a random number of items (1-9)
		const newItemCount = faker.number.int({ min: 1, max: 9 })
		const newItems = generateTransactions(newItemCount)

		// 3. Prepend new items to the array
		transactions = [...newItems, ...transactions]

		// 4. Wait for Svelte to update the DOM
		await tick()

		// 5. Calculate the difference in scroll height (the height of the new items)
		const newScrollHeight = listElement.scrollHeight
		const addedHeight = newScrollHeight - currentScrollHeight

		// 6. Restore the scroll position relative to the new content
		listElement.scrollTop = currentScrollTop + addedHeight

		toast.success('New items loaded!')
	}
</script>

<div class="list-wrapper">
	<h1>Transactions</h1>
	<ul bind:this={listElement}>
		{#each transactions as transaction}
			<li>{transaction}</li>
		{/each}
	</ul>
	<button onclick={addItems}>Add items</button>
</div>

<style>
	.list-wrapper {
		box-sizing: border-box;
		height: 100svh;
		display: flex;
		flex-direction: column;
		padding: 2rem;
	}

	ul {
		outline: 2px solid;
		flex: 1 auto;
		padding: 0;
		margin: 0;
		overflow-y: auto;
	}

	li {
		padding: 2rem;
		border-bottom: 2px solid;
		list-style: none;
	}

	li:last-child {
		border-bottom: 0;
	}

	button {
		position: fixed;
		bottom: 1rem;
		left: 1rem;
	}
</style>
