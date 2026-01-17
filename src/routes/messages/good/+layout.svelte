<script lang="ts">
	import FriendsList from '$lib/components/FriendsList.svelte'
	import Outbox from '$lib/components/Outbox.svelte'
</script>

<div class="messages-layout">
	<div class="sidebar">
		<Outbox />
		<FriendsList />
	</div>
	<slot />
</div>

<style>
	.messages-layout {
		display: grid;
		grid-template-columns: minmax(200px, 1fr) 3fr;
		height: 100%;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}
</style>
