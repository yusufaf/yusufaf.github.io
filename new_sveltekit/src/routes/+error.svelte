<script lang="ts">
	import { page } from '$app/state';
	import { NAME } from '$lib/content/site';
</script>

<svelte:head>
	<title>{page.status} | {NAME}</title>
</svelte:head>

<main>
	<p class="code">{page.status}</p>
	<h1>{page.status === 404 ? 'Nothing printed here.' : 'Something went wrong.'}</h1>
	<a href="/">Back to the print</a>
</main>

<style>
	main {
		min-height: 100vh;
		box-sizing: border-box;
		padding: 0 var(--gutter);
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 16px;
		max-width: var(--measure);
		margin: 0 auto;
	}

	.code {
		margin: 0;
		font-size: clamp(96px, 18vw, 220px);
		line-height: 0.85;
		font-weight: 800;
		font-stretch: 125%;
		color: var(--mist);
	}

	h1 {
		margin: 0;
		font-size: clamp(28px, 4vw, 44px);
		font-weight: 700;
	}

	a {
		font-weight: 600;
		padding: 8px 0;
		align-self: flex-start;
	}
</style>
