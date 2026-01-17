<script lang="ts">
	import favicon from '$lib/assets/favicon.svg'
	import ToastContainer from '$lib/components/ToastContainer.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import { getPresentationNavigationActor } from '$lib/stores/presentationNavigationStore'
	import { getSlideFromPath, slideToPath } from '$lib/machines/presentationNavigationMachine'
	import { getNetworkStatusActor } from '$lib/stores/networkStatusStore'
	import type { NetworkStatusMachineEvents } from '$lib/machines/networkStatusMachine'
	import type { PresentationNavigationEvents } from '$lib/machines/presentationNavigationMachine'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { browser } from '$app/environment'
	
	let { children } = $props()
	import './styles.css'
	import Header from '$lib/components/Header.svelte'

	if (browser) {
		const navigationActor = getPresentationNavigationActor()
		const networkActor = getNetworkStatusActor()

		// Sync navigation state with URL changes
		$effect(() => {
			const currentPath = $page.url.pathname
			const slide = getSlideFromPath(currentPath)
			
			if (slide) {
				const currentSlide = navigationActor.getSnapshot().context.currentSlide
				if (slide.example !== currentSlide.example || slide.view !== currentSlide.view) {
					navigationActor.send({ type: 'GO_TO', slide } satisfies PresentationNavigationEvents)
				}

				// Ensure network is disconnected when loading examples
				const networkState = networkActor.getSnapshot().value
				if (networkState !== 'disconnected') {
					networkActor.send({ type: 'DISCONNECT' } satisfies NetworkStatusMachineEvents)
				}
			}
		})

		// Sync navigation machine state changes to URL
		$effect(() => {
			const subscription = navigationActor.subscribe((newSnapshot) => {
				const currentSlide = newSnapshot.context.currentSlide
				const path = slideToPath(currentSlide)
				const currentPath = $page.url.pathname
				
				if (path !== currentPath) {
					goto(path)
				}
			})
			return () => subscription.unsubscribe()
		})

		// Handle keyboard navigation
		$effect(() => {
			function handleKeyDown(e: KeyboardEvent) {
				// Don't handle keyboard shortcuts when typing in inputs, textareas, etc.
				if (
					e.target instanceof HTMLInputElement ||
					e.target instanceof HTMLTextAreaElement ||
					e.target instanceof HTMLSelectElement ||
					(e.target instanceof HTMLElement && e.target.isContentEditable)
				) {
					return
				}

				if (e.key === 'ArrowRight') {
					e.preventDefault()
					navigationActor.send({ type: 'NEXT' } satisfies PresentationNavigationEvents)
				} else if (e.key === 'ArrowLeft') {
					e.preventDefault()
					navigationActor.send({ type: 'PREV' } satisfies PresentationNavigationEvents)
				}
			}

			window.addEventListener('keydown', handleKeyDown)
			return () => window.removeEventListener('keydown', handleKeyDown)
		})
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main>
	<Header />
	<div class="content">
		{@render children()}
	</div>
	<Footer />
</main>
<ToastContainer />

<style>
	main {
		display: grid;
		grid-template-rows: auto 1fr auto;
		height: 100vh;
	}

	.content {
		overflow-y: auto;
	}
</style>
