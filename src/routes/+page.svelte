<script lang="ts">
	import { browser } from '$app/environment'
	import { friends } from '$lib/stores/friendsStore'
	import { friends as initialFriends } from '$lib/data/friends'

	function clearAllStorage() {
		if (!browser) return

		// Clear all localStorage
		localStorage.clear()

		// Reset friends store to initial state
		friends.set(initialFriends)
	}
</script>

<button class="clear-storage-button" on:click={clearAllStorage}>
	Clear local storage and reset messages
</button>

<div class="page">
	<h1 class="title">Designing for Local-First</h1>
	<p class="subtitle">UX Patterns for a Network-Optional World</p>

	<small>by Matt Derocher</small>
</div>

<style>
	.clear-storage-button {
		/* Visually hidden but accessible */
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
		padding: 0;
		margin: 0;
	}

	.clear-storage-button:focus {
		/* Show when focused (tab navigation) */
		position: fixed;
		top: 1rem;
		left: 1rem;
		z-index: 9999;
		width: auto;
		height: auto;
		overflow: visible;
		clip: auto;
		white-space: normal;
		padding: 0.75rem 1.5rem;
		background: #000;
		color: #fff;
		border: 2px solid #fff;
		border-radius: 0.25rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
	}

	.clear-storage-button:focus:hover {
		background: #333;
	}

	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		text-align: center;
		gap: 2rem;
	}

	.title {
		font-size: 5rem;
	}

	.subtitle {
		font-size: 3rem;
	}

	small {
		font-size: 2.2rem;
	}
</style>
