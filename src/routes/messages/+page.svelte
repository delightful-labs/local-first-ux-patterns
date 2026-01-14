<script>
	import FriendsList from '$lib/components/FriendsList.svelte';
	import MessagesList from '$lib/components/MessagesList.svelte';
</script>

<div>
<FriendsList />
<MessagesList />
</div>

<style>
	div {
		display: grid;
		grid-template-columns: 1fr 6fr;
	}
</style>