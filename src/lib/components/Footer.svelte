<script lang="ts">
	import Button from './Button.svelte'
	import { browser } from '$app/environment'
	import { getPresentationNavigationActor } from '$lib/stores/presentationNavigationStore'
	import type { PresentationNavigationEvents } from '$lib/machines/presentationNavigationMachine'
	import { SLIDES, getSlideIndex } from '$lib/machines/presentationNavigationMachine'
	import { page } from '$app/stores'
	import { getSlideFromPath } from '$lib/machines/presentationNavigationMachine'

	const actor = getPresentationNavigationActor()
	let snapshot = $state(actor.getSnapshot())

	if (browser) {
		$effect(() => {
			const subscription = actor.subscribe((newSnapshot) => {
				snapshot = newSnapshot
			})
			return () => subscription.unsubscribe()
		})
	}

	const currentSlide = $derived(snapshot?.context.currentSlide)
	const currentPath = $derived($page.url.pathname)
	const isPresentationSlide = $derived(getSlideFromPath(currentPath) !== null)

	const currentSlideIndex = $derived(currentSlide ? getSlideIndex(currentSlide) : -1)
	const canGoBack = $derived(currentSlideIndex > 0)
	const canGoForward = $derived(currentSlideIndex >= 0 && currentSlideIndex < SLIDES.length - 1)

	const slideDisplayName = $derived(
		currentSlide?.example === 'root' ? 'Home' : `${currentSlide?.example} / ${currentSlide?.view}`
	)

	function handleNext() {
		if (canGoForward) {
			actor.send({ type: 'NEXT' } satisfies PresentationNavigationEvents)
		}
	}

	function handlePrev() {
		if (canGoBack) {
			actor.send({ type: 'PREV' } satisfies PresentationNavigationEvents)
		}
	}
</script>

<footer class="footer">
	{#if canGoBack}
		<Button onclick={handlePrev} aria-label="Previous slide">← Back</Button>
	{:else}
		<div></div>
	{/if}
	<span class="slide-info">
		{slideDisplayName}
	</span>
	{#if canGoForward}
		<Button onclick={handleNext} aria-label="Next slide">Forward →</Button>
	{:else}
		<div></div>
	{/if}
</footer>

<style>
	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		border-top: var(--border-width) solid black;
		background-color: white;
		gap: 2rem;
	}

	.slide-info {
		font-family: monospace;
		font-size: 0.9em;
		flex: 1;
		text-align: center;
	}
</style>
