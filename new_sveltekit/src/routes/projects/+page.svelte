<script lang="ts">
	import Catalog from '$lib/components/Catalog.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { INTRO, NAME } from '$lib/content/site';

	let { data } = $props();
</script>

<Seo title="Projects | {NAME}" description={INTRO} />

<header>
	<a class="home" href="/">{NAME}</a>
</header>

<main>
	<Catalog loose={data.loose} />
</main>

<Footer />

<style>
	header {
		max-width: var(--measure);
		margin: 0 auto;
		box-sizing: border-box;
		padding: 28px var(--gutter) 0;
	}

	.home {
		display: inline-block;
		padding: 6px 0;
		font-size: 18px;
		font-weight: 800;
		font-stretch: 125%;
	}
</style>
