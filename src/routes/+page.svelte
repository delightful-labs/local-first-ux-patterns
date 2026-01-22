<script lang="ts">
	import { browser } from '$app/environment'
	import { friends } from '$lib/stores/friendsStore'
	import { friends as initialFriends } from '$lib/data/friends'
	import HiddenButton from '$lib/components/HiddenButton.svelte'

	function toggleFullscreen() {
		if (!browser) return

		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch((err) => {
				console.error('Error attempting to enable fullscreen:', err)
			})
		} else {
			document.exitFullscreen().catch((err) => {
				console.error('Error attempting to exit fullscreen:', err)
			})
		}
	}

	function clearAllStorage() {
		if (!browser) return

		// Clear all localStorage
		localStorage.clear()

		// Reset friends store to initial state
		friends.set(initialFriends)
	}
</script>

<HiddenButton onclick={toggleFullscreen} aria-label="Toggle fullscreen">
	Toggle fullscreen
</HiddenButton>

<HiddenButton onclick={clearAllStorage} aria-label="Clear local storage and reset messages">
	Clear local storage and reset messages
</HiddenButton>

<div class="page">
	<h1 class="title">Designing for Local-First</h1>
	<p class="subtitle">UX Patterns for a Network-Optional World</p>

	<small>by Matt Derocher</small>
</div>

<style>
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
