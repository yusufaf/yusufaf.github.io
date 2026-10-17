import { error } from '@sveltejs/kit';
import hotspots from '$lib/print/hotspots.json';
import { SPOT_KEY } from '$lib/content/catalog';
import { formatDay } from '$lib/format';
import { CATALOG_REPOS, findEntry, loadRepos } from '$lib/server/repos';

export function entries() {
	return [...CATALOG_REPOS].map((slug) => ({ slug }));
}

export async function load({ params, fetch }) {
	const found = findEntry(params.slug);
	if (!found) error(404, 'Not found');
	const { group, entry } = found;
	const meta = (await loadRepos(fetch)).find((r) => r.name === params.slug);
	if (!meta) throw new Error(`[catalog] ${params.slug} is curated but not a public repo`);

	// Header crop: the page's object on the print, or plain paper for off-print work.
	let focus = '18% 82%';
	if (group.id !== 'offprint') {
		const [x, y] = hotspots.desktopMap.centres[SPOT_KEY[group.id]];
		focus = `${x}% ${y}%`;
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
			pushed: formatDay(meta.pushedAt, true)
		},
		related: group.entries
			.filter((e) => e.repo && e.repo !== params.slug)
			.map((e) => ({ label: e.label, repo: e.repo! })),
		focus
	};
}
