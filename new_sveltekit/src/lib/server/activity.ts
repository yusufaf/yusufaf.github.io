import { formatDay } from '$lib/format';
import type { RepoMeta } from './repos';

export type Activity = { repo: string; day: string };

/**
 * Pick the repo for the "Lately: <repo>, <day>" line.
 *
 * `listed` is the set of repos the catalog links to; anything else (the site
 * repo itself, the profile README, the Fly configs) shouldn't be what visitors
 * see as "what I'm working on".
 */
export function pickLatest(repos: RepoMeta[], listed: Set<string>): RepoMeta | null {
	let latest: RepoMeta | null = null;
	let latestAt = -Infinity;
	for (const repo of repos) {
		if (!listed.has(repo.name)) continue;
		const at = Date.parse(repo.pushedAt);
		if (Number.isNaN(at)) continue;
		if (at > latestAt) {
			latest = repo;
			latestAt = at;
		}
	}
	return latest;
}

export function activity(repos: RepoMeta[], listed: Set<string>): Activity | null {
	const latest = pickLatest(repos, listed);
	return latest ? { repo: latest.name, day: formatDay(latest.pushedAt) } : null;
}
