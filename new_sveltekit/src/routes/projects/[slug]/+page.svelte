<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { NAME } from '$lib/content/site';

	let { data } = $props();

	const pushed = $derived(
		new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			timeZone: 'America/Los_Angeles'
		}).format(new Date(data.facts.pushedAt))
	);
	const liveLabel = $derived(
		data.entry.live
			? data.entry.live.href.startsWith('https://')
				? new URL(data.entry.live.href).host
				: `yusufaf.dev${data.entry.live.href}`
			: null
	);
</script>

<Seo title="{data.entry.title} | {NAME}" description={data.entry.blurb} />

<div class="band">
	<img
		src="/print/hero-1600.webp"
		alt=""
		width="1600"
		height="1000"
		style="object-position: {data.focus}; transform-origin: {data.focus}"
	/>
	<a class="home" href="/">{NAME}</a>
</div>

<main>
	<div class="body">
		<a class="group" href="/#{data.group.id}">{data.group.name}</a>
		<h1>{data.entry.title}</h1>
		<p class="blurb">{data.entry.blurb}</p>
		<a class="readme" href="https://github.com/yusufaf/{data.entry.repo}#readme"
			>Full README on GitHub</a
		>
	</div>

	<dl class="facts">
		{#if data.entry.live && liveLabel}
			<div>
				<dt>Open it</dt>
				<dd>
					<a href={data.entry.live.href} rel={data.entry.live.external ? 'external' : undefined}
						>{liveLabel}</a
					>
				</dd>
			</div>
		{/if}
		{#if data.facts.language}
			<div>
				<dt>Written in</dt>
				<dd>{data.facts.language}</dd>
			</div>
		{/if}
		<div>
			<dt>Last push</dt>
			<dd>{pushed}</dd>
		</div>
		{#if data.related.length}
			<div>
				<dt>Goes with</dt>
				<dd>
					{#each data.related as r, i (r.repo)}{#if i > 0},
						{/if}<a href="/projects/{r.repo}/">{r.label}</a>{/each}
				</dd>
			</div>
		{/if}
	</dl>
</main>

<Footer />

<style>
	.band {
		position: relative;
		height: clamp(200px, 28vw, 360px);
		overflow: hidden;
		background: var(--print);
	}

	.band img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(1.6);
	}

	.home {
		position: absolute;
		left: var(--gutter);
		top: 28px;
		padding: 6px 10px;
		margin-left: -10px;
		background: var(--print);
		font-size: 18px;
		font-weight: 800;
		font-stretch: 125%;
	}

	main {
		max-width: var(--measure);
		margin: 0 auto;
		box-sizing: border-box;
		padding: 56px var(--gutter) 64px;
		display: flex;
		flex-wrap: wrap;
		gap: 40px 72px;
	}

	.body {
		flex: 999 1 520px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
	}

	.group {
		font-weight: 600;
		color: var(--mist);
	}

	h1 {
		margin: 0;
		font-size: clamp(40px, 5.5vw, 64px);
		line-height: 0.98;
		font-weight: 800;
		font-stretch: 125%;
		overflow-wrap: anywhere;
	}

	.blurb {
		margin: 0;
		max-width: 30em;
		font-size: 24px;
		line-height: 1.4;
		font-weight: 500;
	}

	.readme {
		font-weight: 600;
		padding: 8px 0;
	}

	.facts {
		flex: 1 1 240px;
		max-width: 320px;
		margin: 0;
		padding-top: 40px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	dt {
		color: var(--mist);
	}

	dd {
		margin: 0;
	}

	.facts a {
		font-weight: 700;
	}
</style>
