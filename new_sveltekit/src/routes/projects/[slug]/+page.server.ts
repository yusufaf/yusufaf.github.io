import { error } from '@sveltejs/kit';
import hotspots from '$lib/print/hotspots.json';
import { CATALOG_REPOS, findEntry, repoMeta } from '$lib/server/repos';

export function entries() {
	return [...CATALOG_REPOS].map((slug) => ({ slug }));
}

const SPOT = {
	watch: 'watch',
	record: 'record',
	controller: 'controller',
	basketball: 'net',
	cards: 'cards',
	stencil: 'stencil'
} as const;

export function load({ params }) {
	const found = findEntry(params.slug);
	if (!found) error(404, 'Not found');
	const { group, entry } = found;
	const meta = repoMeta(params.slug);
	if (!meta) throw new Error(`[catalog] ${params.slug} is curated but missing from _repos.json`);

	// Header crop: the page's object on the print, or plain paper for off-print work.
	let focus = '18% 82%';
	if (group.id !== 'offprint') {
		const [x, y, w, h] = hotspots.desktop[SPOT[group.id]];
		focus = `${Math.round(x + w / 2)}% ${Math.round(y + h / 2)}%`;
	}

	return {
		group: { id: group.id, name: group.name },
		entry: {
			title: entry.title ?? entry.label,
			blurb: entry.blurb,
			repo: params.slug,
			live: entry.live ?? null
		},
		facts: {
			language: meta.language,
			pushedAt: meta.pushedAt
		},
		related: group.entries
			.filter((e) => e.repo && e.repo !== params.slug)
			.map((e) => ({ label: e.label, repo: e.repo! })),
		focus
	};
}
