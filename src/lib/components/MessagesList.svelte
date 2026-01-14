<script>
	import { faker } from '@faker-js/faker'

	const friends = Array.from({ length: 20 }, () => faker.lorem.sentence())
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
		gap: 1rem;
		padding: 1rem;
	}

	li {
		padding: 1rem;
		max-width: 40ch;
		background-color: black;
		color: white;
		border-radius: 10px;
	}

	li:nth-child(odd) {
		justify-self: end;
	}
</style>