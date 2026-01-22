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

		// Custom cursor
		$effect(() => {
			const cursorEl = document.getElementById('custom-cursor')
			if (!cursorEl) return

			let rafId: number | null = null
			let mouseX = 0
			let mouseY = 0

			function getComputedCursor(element: Element | null): string {
				if (!element) return 'default'

				// Traverse up the DOM tree to find the actual cursor
				let current: Element | null = element
				while (current) {
					// Check inline style first (this takes precedence over everything)
					if (current instanceof HTMLElement) {
						const inlineCursor = current.style.cursor?.trim()
						if (inlineCursor && inlineCursor !== 'none') {
							return inlineCursor
						}

						// Check for disabled state
						if (current.hasAttribute('disabled') || (current as any).disabled) {
							return 'not-allowed'
						}

						// Check element type and classes for common cursor patterns
						const tagName = current.tagName.toLowerCase()

						// Check if it's a button or link
						if (tagName === 'button' || tagName === 'a') {
							if (!current.hasAttribute('disabled') && !(current as any).disabled) {
								return 'pointer'
							}
						}

						// Check if element has role="button"
						if (current.getAttribute('role') === 'button' && !current.hasAttribute('disabled')) {
							return 'pointer'
						}

						// Check classes that might indicate cursor styles
						// Look through all stylesheets to find matching rules
						for (const sheet of Array.from(document.styleSheets)) {
							try {
								for (const rule of Array.from(sheet.cssRules || sheet.rules || [])) {
									if (rule instanceof CSSStyleRule) {
										try {
											if (current.matches(rule.selectorText)) {
												const cursor = rule.style.cursor
												if (
													cursor &&
													cursor !== 'none' &&
													cursor !== 'auto' &&
													cursor !== 'inherit'
												) {
													return cursor
												}
											}
										} catch (e) {
											// Ignore invalid selectors
										}
									}
								}
							} catch (e) {
								// Ignore cross-origin stylesheet errors
							}
						}
					}

					current = current.parentElement
				}
				return 'default'
			}

			function getCursorImage(cursor: string): string {
				// Map browser cursor types to custom cursor images
				if (cursor === 'not-allowed' || cursor === 'no-drop') {
					return '/images/forbidden.svg'
				}
				if (cursor === 'pointer' || cursor === 'grab' || cursor === 'grabbing') {
					return '/images/hand.svg'
				}
				// Default to pointer for default, auto, and other cursors
				return '/images/pointer.svg'
			}

			function updateCursor() {
				if (!cursorEl) return
				cursorEl.style.left = mouseX + 'px'
				cursorEl.style.top = mouseY + 'px'
				rafId = null
			}

			function handleMouseMove(e: MouseEvent) {
				mouseX = e.clientX
				mouseY = e.clientY

				// Check what cursor the element under the mouse should have
				// Try using the event target first, then fall back to elementsFromPoint
				let elementUnderMouse: Element | null = null

				if (e.target instanceof Element && e.target.id !== 'custom-cursor') {
					elementUnderMouse = e.target
				} else {
					// Use elementsFromPoint to get all elements and skip the custom cursor
					const elements = document.elementsFromPoint(e.clientX, e.clientY)
					elementUnderMouse =
						elements.find((el) => el.id !== 'custom-cursor') || elements[0] || null
				}

				const computedCursor = getComputedCursor(elementUnderMouse)
				const cursorImage = getCursorImage(computedCursor)

				// Update cursor image immediately
				if (cursorEl) {
					cursorEl.style.backgroundImage = `url('${cursorImage}')`
				}

				if (rafId === null) {
					rafId = requestAnimationFrame(updateCursor)
				}
			}

			window.addEventListener('mousemove', handleMouseMove)
			window.addEventListener('mousemove', handleMouseMove)
			return () => {
				window.removeEventListener('mousemove', handleMouseMove)
				if (rafId !== null) {
					cancelAnimationFrame(rafId)
				}
			}
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
{#if browser}
	<div id="custom-cursor"></div>
{/if}

<style>
	main {
		display: grid;
		grid-template-rows: auto 1fr auto;
		height: 100vh;
	}

	.content {
		overflow-y: auto;
	}

	/* Custom cursor styles */
	:global(html),
	:global(body),
	:global(*) {
		cursor: none !important;
	}

	#custom-cursor {
		position: fixed;
		width: 58px;
		height: 64px;
		pointer-events: none;
		background: url('/images/pointer.svg') no-repeat center center;
		background-size: contain;
		z-index: 9999;
		left: 0;
		top: 0;
		will-change: transform;
	}
</style>
