<div class="list-wrapper">
	<div class="sidebar">
		<slot name="sidebar" />
	</div>
	<slot name="list" />
</div>

<style>
	.list-wrapper {
		box-sizing: border-box;
		height: 100%;
		display: grid;
		grid-template-columns: 40ch 1fr;
		margin: 0 auto;
		overflow: hidden;
	}
</style>
