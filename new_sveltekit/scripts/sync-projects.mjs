#!/usr/bin/env node
// Fetches public repo metadata + READMEs for yusufaf's owned repos and writes
// a build-time cache under content/projects/. See
// yusufaf-github-io-Apex-SvelteKit-Rebuild-Plan.md Phase 2 for the design.
//
// Deliberately calls the unauthenticated-safe `GET /users/:username/repos`
// endpoint (not `/user/repos`) so private repos can never appear in the
// source data, regardless of token scope or script bugs.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'projects');
const USERNAME = 'yusufaf';
const TOKEN = process.env.GITHUB_TOKEN;

const EXCLUDE = new Set([
	'yusufaf.github.io', // the apex itself
	'yusufaf', // profile README repo
	'basketball_court_threejs', // handled separately, Phase 3
	'quizaroni', // own subdomain
	'nba-central', // own subdomain
	'sfn-diagram', // own subdomain (sfn.yusufaf.dev)
	'mjolnir', // gets /mjolnir/ via Pages rebasing — collision
	// own subdomain (spicetify.yusufaf.dev), shown via externalProjects.ts
	'spicetify-album-length',
	'spicetify-enhanced-folders',
	'spicetify-enhanced-pins',
	'spicetify-listening-list',
	'spicetify-local-files-plus',
	'spicetify-rym',
	'spicetify-site' // the docs site itself, spicetify.yusufaf.dev
	// judgment calls, review by hand before first run:
	// 'tf2-loadout-assistant', 'sfn-diagram-action'
]);

function ghHeaders() {
	const headers = {
		Accept: 'application/vnd.github+json',
		'User-Agent': 'yusufaf-github-io-sync-projects',
		'X-GitHub-Api-Version': '2022-11-28'
	};
	if (TOKEN) {
		headers.Authorization = `Bearer ${TOKEN}`;
	}
	return headers;
}

function parseNextLink(linkHeader) {
	if (!linkHeader) return null;
	const parts = linkHeader.split(',');
	for (const part of parts) {
		const match = part.match(/<([^>]+)>;\s*rel="next"/);
		if (match) return match[1];
	}
	return null;
}

async function listOwnedRepos() {
	let url = `https://api.github.com/users/${USERNAME}/repos?type=owner&per_page=100&sort=updated`;
	const all = [];
	while (url) {
		const res = await fetch(url, { headers: ghHeaders() });
		if (!res.ok) {
			throw new Error(`Failed to list repos: ${res.status} ${res.statusText}`);
		}
		const page = await res.json();
		all.push(...page);
		url = parseNextLink(res.headers.get('link'));
	}
	return all;
}

async function fetchReadme(repoName) {
	const res = await fetch(`https://api.github.com/repos/${USERNAME}/${repoName}/readme`, {
		headers: ghHeaders()
	});
	if (res.status === 404) {
		return null;
	}
	if (!res.ok) {
		throw new Error(`Failed to fetch README for ${repoName}: ${res.status} ${res.statusText}`);
	}
	const data = await res.json();
	const markdown = Buffer.from(data.content, data.encoding ?? 'base64').toString('utf-8');
	return { markdown, sha: data.sha };
}

async function readCachedFile(slug) {
	try {
		const raw = await readFile(path.join(CONTENT_DIR, `${slug}.json`), 'utf-8');
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

async function main() {
	await mkdir(CONTENT_DIR, { recursive: true });

	if (!TOKEN) {
		console.warn(
			'[sync-projects] GITHUB_TOKEN not set — proceeding unauthenticated (lower rate limit).'
		);
	}

	const now = new Date().toISOString();
	const successSlugs = [];
	const failedSlugs = [];

	let repos;
	try {
		repos = await listOwnedRepos();
	} catch (err) {
		console.error(`[sync-projects] Failed to list repos: ${err.message}`);
		repos = [];
	}

	const candidates = repos.filter((repo) => !repo.fork && !EXCLUDE.has(repo.name));

	console.log(`[sync-projects] ${candidates.length} candidate repos after filtering.`);

	for (const repo of candidates) {
		const cached = await readCachedFile(repo.name);
		try {
			const readme = await fetchReadme(repo.name);

			if (!readme) {
				console.warn(`[sync-projects] ${repo.name}: no README found, skipping.`);
				failedSlugs.push(repo.name);
				// A cached file on disk from a prior successful sync still needs a
				// slot in the index -- entries() prerenders from this list, and
				// dropping a slug here would silently 404 a page that still exists
				// on disk, just with stale content. Only truly-never-synced repos
				// are left out entirely.
				if (cached) successSlugs.push(repo.name);
				continue;
			}

			if (cached && cached.readmeSha === readme.sha) {
				// Unchanged README — still refresh lightweight metadata that can
				// drift without a README change (stars, description, pushedAt).
				const updated = {
					...cached,
					description: repo.description ?? '',
					homepage: repo.homepage ?? '',
					topics: repo.topics ?? [],
					language: repo.language ?? '',
					stars: repo.stargazers_count ?? 0,
					pushedAt: repo.pushed_at,
					defaultBranch: repo.default_branch,
					fetchedAt: now
				};
				await writeFile(
					path.join(CONTENT_DIR, `${repo.name}.json`),
					JSON.stringify(updated, null, 2) + '\n',
					'utf-8'
				);
				successSlugs.push(repo.name);
				continue;
			}

			const entry = {
				repo: repo.name,
				fullName: repo.full_name,
				description: repo.description ?? '',
				homepage: repo.homepage ?? '',
				topics: repo.topics ?? [],
				language: repo.language ?? '',
				stars: repo.stargazers_count ?? 0,
				pushedAt: repo.pushed_at,
				defaultBranch: repo.default_branch,
				readmeMarkdown: readme.markdown,
				readmeSha: readme.sha,
				fetchedAt: now
			};

			await writeFile(
				path.join(CONTENT_DIR, `${repo.name}.json`),
				JSON.stringify(entry, null, 2) + '\n',
				'utf-8'
			);
			successSlugs.push(repo.name);
			console.log(`[sync-projects] ${repo.name}: updated.`);
		} catch (err) {
			console.error(`[sync-projects] ${repo.name}: ${err.message}`);
			failedSlugs.push(repo.name);
			// Same reasoning as the no-README branch above: a transient error
			// (network blip, 5xx) shouldn't un-list a repo that's already cached.
			if (cached) successSlugs.push(repo.name);
		}
	}

	const lastFullSyncSuccess = failedSlugs.length === 0 && successSlugs.length > 0;

	const index = {
		slugs: successSlugs.sort(),
		lastSyncAttempt: now,
		lastFullSyncSuccess,
		failedSlugs
	};

	await writeFile(
		path.join(CONTENT_DIR, '_index.json'),
		JSON.stringify(index, null, 2) + '\n',
		'utf-8'
	);

	console.log(
		`[sync-projects] Done. ${successSlugs.length} succeeded, ${failedSlugs.length} failed.`
	);

	if (successSlugs.length === 0) {
		// Genuine first-run catastrophe only if the cache dir is also empty.
		try {
			const { readdir } = await import('node:fs/promises');
			const files = (await readdir(CONTENT_DIR)).filter((f) => f !== '_index.json');
			if (files.length === 0) {
				console.error('[sync-projects] Zero usable repos and empty cache — failing the run.');
				process.exit(1);
			}
		} catch {
			process.exit(1);
		}
	}
}

main().catch((err) => {
	console.error('[sync-projects] Fatal error:', err);
	process.exit(1);
});
