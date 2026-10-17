<script lang="ts">
	import { goto } from '$app/navigation';
	import hotspots from '$lib/print/hotspots.json';
	import { PRINT_OBJECTS, ORDERED_OBJECTS, type ObjectId } from '$lib/content/catalog';
	import { INTRO, LINKS, NAME, RESUME_PDF, TITLE } from '$lib/content/site';

	const ALT =
		'Cyanotype photogram: a 7-inch record, three index cards, a Galaxy Watch, a flowchart stencil, a game controller with its cable, and a basketball net, printed white on blue.';

	// Renderer keys -> catalog objects; the net stands in for basketball.
	const FROM_KEY: Record<string, ObjectId> = {
		watch: 'watch',
		record: 'record',
		controller: 'controller',
		net: 'basketball',
		cards: 'cards',
		stencil: 'stencil'
	};

	// Decode the renderer's owner grid once: which object (if any) owns each cell.
	const map = hotspots.desktopMap;
	const owner = new Int8Array(map.w * map.h);
	{
		let i = 0;
		for (const [key, count] of map.runs) owner.fill(key, i, (i += count));
	}

	// Centre of each object's own cells, for placing the caption on keyboard focus.
	const centre: Partial<Record<ObjectId, { x: number; y: number }>> = {};
	map.keys.forEach((key, k) => {
		let sx = 0;
		let sy = 0;
		let n = 0;
		owner.forEach((o, i) => {
			if (o !== k) return;
			sx += i % map.w;
			sy += Math.floor(i / map.w);
			n++;
		});
		if (n) {
			centre[FROM_KEY[key]] = {
				x: ((sx / n + 0.5) / map.w) * 100,
				y: ((sy / n + 0.5) / map.h) * 100
			};
		}
	});

	const objects = ORDERED_OBJECTS.map((id) => {
		const group = PRINT_OBJECTS.find((g) => g.id === id)!;
		const key = Object.keys(FROM_KEY).find(
			(k) => FROM_KEY[k] === id
		) as keyof typeof hotspots.desktop;
		const [x, y, w, h] = hotspots.desktop[key];
		return {
			id,
			name: group.printName ?? group.name,
			caption: group.caption,
			count: group.entries.length,
			x,
			y,
			w,
			h
		};
	});

	let active: ObjectId | null = $state(null);
	let at = $state({ x: 0, y: 0 });
	const current = $derived(objects.find((o) => o.id === active));

	function objectAt(e: PointerEvent): ObjectId | null {
		const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const fx = (e.clientX - box.left) / box.width;
		const fy = (e.clientY - box.top) / box.height;
		const cx = Math.min(map.w - 1, Math.max(0, Math.floor(fx * map.w)));
		const cy = Math.min(map.h - 1, Math.max(0, Math.floor(fy * map.h)));
		const k = owner[cy * map.w + cx];
		at = { x: fx * 100, y: fy * 100 };
		return k < 0 ? null : FROM_KEY[map.keys[k]];
	}

	function focusOn(id: ObjectId) {
		active = id;
		at = centre[id] ?? at;
	}
</script>

<header class="hero">
	<div class="print">
		<picture>
			<source
				type="image/avif"
				media="(max-width: 699px)"
				srcset="/print/hero-mobile-780.avif 780w, /print/hero-mobile-1200.avif 1200w"
				sizes="100vw"
			/>
			<source
				type="image/webp"
				media="(max-width: 699px)"
				srcset="/print/hero-mobile-780.webp 780w, /print/hero-mobile-1200.webp 1200w"
				sizes="100vw"
			/>
			<source
				type="image/avif"
				srcset="/print/hero-1600.avif 1600w, /print/hero-2400.avif 2400w"
				sizes="100vw"
			/>
			<img
				src="/print/hero-1600.webp"
				srcset="/print/hero-1600.webp 1600w, /print/hero-2400.webp 2400w"
				sizes="100vw"
				alt={ALT}
				width="1600"
				height="1000"
				fetchpriority="high"
			/>
		</picture>
		<div class="sensitizer" aria-hidden="true"></div>

		<!-- Pointer hit-testing uses the renderer's pixel map, not the link boxes,
		     which overlap. The links below are the keyboard and screen reader path. -->
		<div
			class="hit"
			class:on={active !== null}
			aria-hidden="true"
			onpointermove={(e) => (active = objectAt(e))}
			onpointerleave={() => (active = null)}
			onclick={() => active && goto(`#${active}`)}
		></div>

		<nav class="spots" aria-label="Objects on the print">
			{#each objects as o (o.id)}
				<a
					href="#{o.id}"
					class="spot"
					style="left: {o.x}%; top: {o.y}%; width: {o.w}%; height: {o.h}%"
					aria-label="{o.name}: {o.caption} {o.count} {o.count === 1 ? 'project' : 'projects'}"
					onfocus={() => focusOn(o.id)}
					onblur={() => (active = null)}
				></a>
			{/each}
		</nav>

		{#if current}
			<span
				class="caption"
				class:left={at.x > 70}
				class:up={at.y > 72}
				style="left: {at.x}%; top: {at.y}%"
				aria-hidden="true"><strong>{current.name}</strong> {current.caption}</span
			>
		{/if}
	</div>

	<div class="intro">
		<h1>{NAME}</h1>
		<p class="title">{TITLE}</p>
		<p>{INTRO}</p>
		<ul class="links">
			{#if RESUME_PDF}
				<li><a href={RESUME_PDF}>Resume</a></li>
			{/if}
			{#each LINKS as link (link.href)}
				<li>
					<a href={link.href} rel={link.href.startsWith('http') ? 'me' : undefined}>{link.label}</a>
				</li>
			{/each}
		</ul>
	</div>
</header>

<style>
	.hero {
		position: relative;
		background: var(--print);
	}

	.print {
		position: relative;
		aspect-ratio: 16 / 10;
	}

	picture,
	img {
		display: block;
		width: 100%;
		height: 100%;
	}

	img {
		object-fit: cover;
	}

	/* Unexposed paper: fades to reveal the print on the first visit. */
	.sensitizer {
		position: absolute;
		inset: 0;
		background: var(--sensitizer);
		opacity: 0;
		pointer-events: none;
	}

	:global(html.develop) .sensitizer {
		animation: develop 1.2s cubic-bezier(0.3, 0, 0.2, 1) forwards;
	}

	@keyframes develop {
		from {
			opacity: 0.88;
		}
		to {
			opacity: 0;
		}
	}

	.hit,
	.spots {
		position: absolute;
		inset: 0;
	}

	.hit.on {
		cursor: pointer;
	}

	/* Keyboard targets only; the pointer is handled by .hit underneath. */
	.spot {
		position: absolute;
		min-width: 44px;
		min-height: 44px;
		pointer-events: none;
	}

	.spot:focus-visible {
		outline-offset: -2px;
	}

	.caption {
		position: absolute;
		z-index: 2;
		width: max-content;
		max-width: 280px;
		padding: 8px 10px;
		background: var(--print);
		color: var(--exposed);
		font-size: 15px;
		line-height: 1.4;
		pointer-events: none;
		transform: translate(16px, 16px);
	}

	.caption.left {
		transform: translate(calc(-100% - 16px), 16px);
	}

	.caption.up {
		transform: translate(16px, calc(-100% - 16px));
	}

	.caption.left.up {
		transform: translate(calc(-100% - 16px), calc(-100% - 16px));
	}

	.caption strong {
		display: block;
	}

	.intro {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 28px var(--gutter) 40px;
	}

	h1 {
		margin: 0;
		font-size: clamp(48px, 7vw, 92px);
		line-height: 0.9;
		font-weight: 800;
		font-stretch: 125%;
		letter-spacing: -0.01em;
	}

	.title {
		margin: 0;
		font-weight: 600;
		color: var(--mist);
	}

	.intro p {
		margin: 0;
		max-width: 34em;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 22px;
		margin: 4px 0 0;
		padding: 0;
		list-style: none;
		font-weight: 600;
	}

	.links a {
		display: inline-block;
		padding: 10px 0;
	}

	/* Phones get the portrait print; its object boxes don't match the desktop
	   hit areas, so the caption list below does the navigating there. */
	@media (max-width: 699px) {
		.print {
			aspect-ratio: 780 / 1365;
		}

		.hit,
		.spots,
		.caption {
			display: none;
		}
	}

	/* Wide screens: the intro sits on the open blue in the lower left. */
	@media (min-width: 1100px) {
		.intro {
			position: absolute;
			left: var(--gutter);
			top: 47%;
			max-width: min(36%, 560px);
			padding: 0;
		}

		.intro p {
			font-size: 19px;
		}
	}
</style>
