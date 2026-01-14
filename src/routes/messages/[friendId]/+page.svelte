<script lang="ts">
	import MessagesList from '$lib/components/MessagesList.svelte'
	import type { Friend } from '$lib/data/friends'

	export let data: {
		friend: Friend
	}
</script>

<MessagesList friend={data.friend} />
