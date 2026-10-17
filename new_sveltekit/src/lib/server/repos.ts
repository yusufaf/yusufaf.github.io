import snapshot from '../../../content/projects/_repos.json';
import { GROUPS, UNLISTED_REPOS, type Entry, type Group } from '$lib/content/catalog';

export type RepoMeta = {
	name: string;
	description: string;
	homepage: string;
	language: string;
	pushedAt: string;
};

/** Committed snapshot, refreshed by the sync workflow. Used when the API is unreachable. */
export const SNAPSHOT: RepoMeta[] = snapshot;

/** Repo names the catalog links to. */
export const CATALOG_REPOS = new Set(
	GROUPS.flatMap((g) => g.entries.map((e) => e.repo)).filter((r): r is string => Boolean(r))
);

let pending: Promise<RepoMeta[]> | null = null;

/**
 * Public, non-fork repos, fetched once per build so every page agrees on dates.
 * Falls back to the snapshot when GitHub is down or rate limited.
 */
export function loadRepos(fetchImpl: typeof fetch = fetch): Promise<RepoMeta[]> {
	pending ??= fetchRepos(fetchImpl);
	return pending;
}

async function fetchRepos(fetchImpl: typeof fetch): Promise<RepoMeta[]> {
	try {
		const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
		// $env/dynamic can't be read while prerendering, so go to the Node env directly.
		const token = (globalThis as { process?: { env: Record<string, string | undefined> } }).process
			?.env.GITHUB_TOKEN;
		if (token) headers.Authorization = `Bearer ${token}`;
		const res = await fetchImpl(
			'https://api.github.com/users/yusufaf/repos?type=owner&per_page=100',
			{ headers }
		);
		if (!res.ok) return SNAPSHOT;
		const live: {
			name: string;
			fork: boolean;
			description: string | null;
			homepage: string | null;
			language: string | null;
			pushed_at: string;
		}[] = await res.json();
		return live
			.filter((r) => !r.fork)
			.map((r) => ({
				name: r.name,
				description: r.description ?? '',
				homepage: r.homepage ?? '',
				language: r.language ?? '',
				pushedAt: r.pushed_at
			}));
	} catch {
		return SNAPSHOT;
	}
}

/**
 * Public repos that are neither curated nor deliberately unlisted. They land in
 * the catalog's catch-all so a new repo never silently disappears.
 */
export function unmappedRepos(repos: RepoMeta[]): RepoMeta[] {
	return repos.filter((r) => !CATALOG_REPOS.has(r.name) && !UNLISTED_REPOS.has(r.name));
}

export function findEntry(repo: string): { group: Group; entry: Entry } | undefined {
	for (const group of GROUPS) {
		const entry = group.entries.find((e) => e.repo === repo);
		if (entry) return { group, entry };
	}
	return undefined;
}
