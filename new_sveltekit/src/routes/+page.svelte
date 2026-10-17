<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Catalog from '$lib/components/Catalog.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { PRINT_OBJECTS } from '$lib/content/catalog';
	import { INTRO, MOD_LINE, NAME } from '$lib/content/site';

	let { data } = $props();
</script>

<Seo title={NAME} description={INTRO} />

<a class="skip" href="#catalog">Skip to projects</a>

<Hero />

<main>
	<section class="legend" aria-label="What's on the print">
		<p class="mod">{MOD_LINE}</p>
		<ul>
			{#each PRINT_OBJECTS as g (g.id)}
				<li>
					<a href="#{g.id}">{g.printName ?? g.name}</a>
					<span>{g.caption}</span>
				</li>
			{/each}
		</ul>
	</section>

	<Catalog loose={data.loose} />
</main>

<Footer activity={data.activity} />

<style>
	.legend {
		max-width: var(--measure);
		margin: 0 auto;
		box-sizing: border-box;
		padding: 88px var(--gutter) 40px;
		display: flex;
		flex-wrap: wrap;
		gap: 40px 72px;
	}

	.mod {
		flex: 1 1 320px;
		max-width: 420px;
		margin: 0;
		font-size: 26px;
		line-height: 1.35;
		font-weight: 500;
	}

	ul {
		flex: 999 1 480px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 22px 40px;
		margin: 0;
		padding: 0;
		list-style: none;
		line-height: 1.45;
	}

	li a {
		display: block;
		font-weight: 700;
	}

	li span {
		color: var(--mist);
	}
</style>
