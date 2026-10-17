<script lang="ts">
	import { LINKS, NAME, RESUME_PDF } from '$lib/content/site';

	// The old site served /resume; keep the URL working. Points at the PDF once
	// there is one, LinkedIn until then.
	const target = RESUME_PDF ?? LINKS.find((l) => l.label === 'LinkedIn')!.href;
</script>

<svelte:head>
	<title>Resume | {NAME}</title>
	<meta http-equiv="refresh" content="0; url={target}" />
	<meta name="robots" content="noindex" />
</svelte:head>

<main>
	<a href={target}>Resume</a>
</main>

<style>
	main {
		padding: 56px var(--gutter);
	}
</style>
