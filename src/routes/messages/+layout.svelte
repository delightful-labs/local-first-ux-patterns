<script lang="ts">
	import FriendsList from '$lib/components/FriendsList.svelte'
	import type { Friend } from '$lib/data/friends'

	export let data: {
		friends: Friend[]
	}
</script>

<div class="messages-layout">
	<FriendsList friends={data.friends} />
	<slot />
</div>

<style>
	.messages-layout {
		display: grid;
		grid-template-columns: minmax(200px, 1fr) 3fr;
		min-height: 100%;
	}
</style>
