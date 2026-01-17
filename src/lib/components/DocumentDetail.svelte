<script lang="ts">
	import type { Document } from '$lib/machines/syncingFilesMachine'

	interface Props {
		document: Document | null
	}

	let { document }: Props = $props()
</script>

{#if document}
	<article>
		<h1>{document.title}</h1>
		<div class="body">{document.body}</div>
	</article>
{:else}
	<div class="empty">
		<p>Document not available</p>
		<p class="hint">This document may not be synced yet.</p>
	</div>
{/if}

<style>
	article {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		margin: 0 0 2rem 0;
		font-size: 2rem;
		border-bottom: var(--border-width) solid;
		padding-bottom: 1rem;
	}

	.body {
		font-family: 'FlowBlock';
		line-height: 1.6;
		white-space: pre-wrap;
	}

	.empty {
		padding: 4rem 2rem;
		text-align: center;
		max-width: 600px;
		margin: 0 auto;
	}

	.empty p {
		margin: 0.5rem 0;
	}

	.hint {
		color: #666;
		font-style: italic;
	}
</style>
