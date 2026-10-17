import repoList from '../../../content/projects/_repos.json';
import { GROUPS, UNLISTED_REPOS, type Entry, type Group } from '$lib/content/catalog';

export type RepoMeta = {
	name: string;
	description: string;
	homepage: string;
	language: string;
	pushedAt: string;
};

export const REPOS: RepoMeta[] = repoList;
const byName = new Map(REPOS.map((r) => [r.name, r]));

export function repoMeta(name: string): RepoMeta | undefined {
	return byName.get(name);
}

/** Repo names the catalog links to. */
export const CATALOG_REPOS = new Set(
	GROUPS.flatMap((g) => g.entries.map((e) => e.repo)).filter((r): r is string => Boolean(r))
);

/**
 * Public repos that are neither curated nor deliberately unlisted. They land in
 * the catalog's catch-all so a new repo never silently disappears.
 */
export function unmappedRepos(): RepoMeta[] {
	return REPOS.filter((r) => !CATALOG_REPOS.has(r.name) && !UNLISTED_REPOS.has(r.name));
}

export function findEntry(repo: string): { group: Group; entry: Entry } | undefined {
	for (const group of GROUPS) {
		const entry = group.entries.find((e) => e.repo === repo);
		if (entry) return { group, entry };
	}
	return undefined;
}
