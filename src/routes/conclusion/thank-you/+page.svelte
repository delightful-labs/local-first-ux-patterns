<script>
	import OneColumn from '$lib/components/layout/OneColumn.svelte'
</script>

<OneColumn>
	<h2>Thank you!</h2>
	<div class="links">
		<div class="presentation-link">
			<span
				><strong>Slides:</strong>
				<a href="https://fossdem-2026.delightfullabs.com">https://fossdem-2026.delightfullabs.com</a
				></span
			>
			<img src="/images/qr-code.svg" alt="QR Code" />
		</div>
		<div class="">
			<strong>Bluesky:</strong> <a href="https://bsky.app/profile/derocher.me">@derocher.me</a>
		</div>
	</div>
</OneColumn>

<style>
	.links {
		font-size: 2rem;
		display: grid;
		gap: 1rem;
		margin-top: 2rem;
	}
	.presentation-link {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	img {
		width: 10vw;
		height: 10vw;
	}
</style>
