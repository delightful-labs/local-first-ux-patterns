<script>
	import { faker } from '@faker-js/faker'

	const friends = Array.from({ length: 20 }, () => faker.person.fullName())
</script>


<ul>
    {#each friends as friend}
        <li>{friend}</li>
    {/each}
</ul>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		border: 1px solid;
	}

	li {
		padding: 1rem;
	}

	li:not(:last-child) {
		border-bottom: 1px solid;
	}
</style>