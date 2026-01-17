import { setup, assign } from 'xstate'

export type PresentationSlide = {
	example: 'root' | 'messages' | 'loading-lists' | 'syncing-files' | 'multiplayer'
	view: 'landing' | 'bad' | 'good'
}

export type PresentationNavigationEvents =
	| { type: 'NEXT' }
	| { type: 'PREV' }
	| { type: 'GO_TO'; slide: PresentationSlide }

export interface PresentationNavigationContext {
	currentSlide: PresentationSlide
}

export const SLIDES: PresentationSlide[] = [
	{ example: 'root', view: 'landing' },
	{ example: 'messages', view: 'landing' },
	{ example: 'messages', view: 'bad' },
	{ example: 'messages', view: 'good' },
	{ example: 'loading-lists', view: 'landing' },
	{ example: 'loading-lists', view: 'bad' },
	{ example: 'loading-lists', view: 'good' },
	{ example: 'syncing-files', view: 'landing' },
	{ example: 'syncing-files', view: 'bad' },
	{ example: 'syncing-files', view: 'good' },
	{ example: 'multiplayer', view: 'landing' },
	{ example: 'multiplayer', view: 'bad' },
	{ example: 'multiplayer', view: 'good' }
]

export function getSlideIndex(slide: PresentationSlide): number {
	return SLIDES.findIndex((s) => s.example === slide.example && s.view === slide.view)
}

function parseSlideFromPath(path: string): PresentationSlide | null {
	// Handle root path
	if (path === '/' || path === '') {
		return { example: 'root', view: 'landing' }
	}

	// Extract example and view from path like "/messages/bad" or "/messages"
	const match = path.match(/\/([^/]+)(?:\/([^/]+))?/)
	if (!match) return null

	const [, example, view] = match
	if (!example) return null

	const validExamples = ['messages', 'loading-lists', 'syncing-files', 'multiplayer']
	if (!validExamples.includes(example)) return null

	if (!view || view === example) {
		return { example: example as PresentationSlide['example'], view: 'landing' }
	}

	const validViews = ['bad', 'good']
	if (validViews.includes(view)) {
		return { example: example as PresentationSlide['example'], view: view as 'bad' | 'good' }
	}

	return null
}

function buildPathFromSlide(slide: PresentationSlide): string {
	if (slide.example === 'root') {
		return '/'
	}
	if (slide.view === 'landing') {
		return `/${slide.example}`
	}
	return `/${slide.example}/${slide.view}`
}

export const presentationNavigationMachine = setup({
	types: {
		context: {} as PresentationNavigationContext,
		events: {} as PresentationNavigationEvents
	}
}).createMachine({
	id: 'presentationNavigation',
	initial: 'active',
	context: {
		currentSlide: SLIDES[0]
	},
	states: {
		active: {
			on: {
				NEXT: {
					actions: assign(({ context }) => {
						const currentIndex = getSlideIndex(context.currentSlide)
						if (currentIndex < SLIDES.length - 1) {
							return { currentSlide: SLIDES[currentIndex + 1] }
						}
						return {}
					})
				},
				PREV: {
					actions: assign(({ context }) => {
						const currentIndex = getSlideIndex(context.currentSlide)
						if (currentIndex > 0) {
							return { currentSlide: SLIDES[currentIndex - 1] }
						}
						return {}
					})
				},
				GO_TO: {
					actions: assign(({ event }) => {
						return { currentSlide: event.slide }
					})
				}
			}
		}
	}
})

export { parseSlideFromPath as getSlideFromPath }
export { buildPathFromSlide as slideToPath }
