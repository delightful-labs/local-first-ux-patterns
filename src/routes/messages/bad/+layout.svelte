<script lang="ts">
	import FriendsList from '$lib/components/FriendsList.svelte'
</script>

<div class="messages-layout">
	<FriendsList />
	<slot />
</div>

<style>
	.messages-layout {
		display: grid;
		grid-template-columns: minmax(200px, 1fr) 3fr;
		height: 100%;
	}
</style>
