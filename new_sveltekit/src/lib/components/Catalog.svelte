<script lang="ts">
	import { GROUPS, type Entry } from '$lib/content/catalog';

	type Loose = { name: string; description: string };
	let { loose = [] }: { loose?: Loose[] } = $props();

	function nameHref(e: Entry): string {
		return e.repo ? `/projects/${e.repo}/` : (e.href ?? '#');
	}

	// Entries named after their own hostname end with a "Live." link to it.
	function liveSuffix(e: Entry): string | null {
		if (!e.live?.href.startsWith('https://')) return null;
		return new URL(e.live.href).host === e.label ? e.live.href : null;
	}
</script>

<section id="catalog" class="catalog" aria-label="Projects">
	{#each GROUPS as group (group.id)}
		<div class="group" id={group.id}>
			<h2 class:muted={group.id === 'offprint'}>{group.name}</h2>
			<ul>
				{#each group.entries as e (e.label)}
					{@const live = liveSuffix(e)}
					<li>
						<a class="name" href={nameHref(e)}>{e.label}</a>
						<span class="blurb">
							{e.blurb}
							{#if live}<a href={live}>Live.</a>{/if}
						</span>
					</li>
				{/each}
			</ul>
		</div>
	{/each}

	{#if loose.length}
		<div class="group" id="loose">
			<h2 class="muted">Also on GitHub</h2>
			<ul>
				{#each loose as repo (repo.name)}
					<li>
						<a class="name" href="https://github.com/yusufaf/{repo.name}">{repo.name}</a>
						<span class="blurb">{repo.description}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</section>

<style>
	.catalog {
		max-width: var(--measure);
		margin: 0 auto;
		box-sizing: border-box;
		padding: 40px var(--gutter) 88px;
		display: flex;
		flex-direction: column;
		gap: 64px;
	}

	.group {
		display: flex;
		flex-wrap: wrap;
		gap: 16px 72px;
		scroll-margin-top: 24px;
	}

	h2 {
		flex: 1 1 220px;
		max-width: 260px;
		margin: 0;
		font-size: 30px;
		line-height: 1.1;
		font-weight: 800;
		font-stretch: 125%;
	}

	h2.muted {
		color: var(--mist);
	}

	ul {
		flex: 999 1 520px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin: 0;
		padding: 0;
		list-style: none;
		line-height: 1.45;
	}

	.name {
		font-weight: 700;
	}

	.blurb {
		color: var(--mist);
	}

	.blurb a {
		color: var(--mist);
	}
</style>
