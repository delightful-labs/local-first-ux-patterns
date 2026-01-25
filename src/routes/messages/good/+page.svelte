<script lang="ts">
	import { goto } from '$app/navigation'
	import { friends } from '$lib/stores/friendsStore'
	import { get } from 'svelte/store'
	import { browser } from '$app/environment'

	if (browser) {
		// Redirect to first friend's page when landing on this route
		$effect(() => {
			// Get current value immediately
			const friendsList = get(friends)
			if (friendsList.length > 0) {
				const firstFriend = friendsList[0]
				goto(`/messages/good/${firstFriend.id}`, { replaceState: true })
				return
			}

			// If no friends yet, subscribe and wait
			const unsubscribe = friends.subscribe((friendsList) => {
				if (friendsList.length > 0) {
					const firstFriend = friendsList[0]
					goto(`/messages/good/${firstFriend.id}`, { replaceState: true })
					unsubscribe()
				}
			})
			return unsubscribe
		})
	}
</script>

<p>Select a friend from the list to view their messages.</p>

<style>
	p {
		padding: 1rem;
		border-left: var(--border-width) solid;
	}
</style>
