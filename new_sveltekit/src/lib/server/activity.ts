import type { RepoMeta } from './repos';

export type Activity = { repo: string; day: string };

/**
 * Pick the repo for the "Lately: <repo>, <day>" line.
 *
 * `repos` comes from the GitHub API at build time, or from the committed
 * _repos.json when the API is unreachable. `listed` is the set of repos the
 * catalog links to; anything else (the site repo itself, the profile README,
 * the Fly configs) shouldn't be what visitors see as "what I'm working on".
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

// Day precision only, in Pacific time: a timestamp would publish working hours.
const DAY = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	timeZone: 'America/Los_Angeles'
});

export async function loadActivity(
	fallback: RepoMeta[],
	listed: Set<string>,
	fetchImpl: typeof fetch = fetch
): Promise<Activity | null> {
	let repos = fallback;
	try {
		const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
		// $env/dynamic can't be read while prerendering, so go to the Node env directly.
		const token = (globalThis as { process?: { env: Record<string, string | undefined> } }).process
			?.env.GITHUB_TOKEN;
		if (token) headers.Authorization = `Bearer ${token}`;
		const res = await fetchImpl(
			'https://api.github.com/users/yusufaf/repos?type=owner&sort=pushed&per_page=50',
			{ headers }
		);
		if (res.ok) {
			const live: { name: string; fork: boolean; pushed_at: string }[] = await res.json();
			const known = new Map(fallback.map((r) => [r.name, r]));
			repos = live
				.filter((r) => !r.fork)
				.map((r) => ({
					...(known.get(r.name) ?? { description: '', homepage: '', language: '' }),
					name: r.name,
					pushedAt: r.pushed_at
				}));
		}
	} catch {
		// Offline or rate limited: the committed snapshot is good enough.
	}
	const latest = pickLatest(repos, listed);
	return latest ? { repo: latest.name, day: DAY.format(new Date(latest.pushedAt)) } : null;
}
