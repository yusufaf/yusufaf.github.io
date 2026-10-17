#!/usr/bin/env node
// Writes content/projects/_repos.json: light metadata for yusufaf's public,
// non-fork repos. The build uses it as a fallback when the GitHub API is
// unreachable, and to keep the catalog's catch-all honest.
//
// Deliberately calls `GET /users/:username/repos` (not `/user/repos`) so
// private repos can never appear, regardless of token scope.

import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'projects');
const USERNAME = 'yusufaf';
const TOKEN = process.env.GITHUB_TOKEN;

function parseNextLink(linkHeader) {
	if (!linkHeader) return null;
	for (const part of linkHeader.split(',')) {
		const match = part.match(/<([^>]+)>;\s*rel="next"/);
		if (match) return match[1];
	}
	return null;
}

async function listOwnedRepos() {
	const headers = {
		Accept: 'application/vnd.github+json',
		'User-Agent': 'yusufaf-github-io-sync-projects',
		'X-GitHub-Api-Version': '2022-11-28'
	};
	if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
	let url = `https://api.github.com/users/${USERNAME}/repos?type=owner&per_page=100`;
	const all = [];
	while (url) {
		const res = await fetch(url, { headers });
		if (!res.ok) throw new Error(`Failed to list repos: ${res.status} ${res.statusText}`);
		all.push(...(await res.json()));
		url = parseNextLink(res.headers.get('link'));
	}
	return all;
}

const repos = await listOwnedRepos();
const meta = repos
	.filter((repo) => !repo.fork)
	.map((repo) => ({
		name: repo.name,
		description: repo.description ?? '',
		homepage: repo.homepage ?? '',
		language: repo.language ?? '',
		pushedAt: repo.pushed_at
	}))
	.sort((a, b) => a.name.localeCompare(b.name));

if (meta.length === 0) {
	console.error('[sync-projects] GitHub returned no repos; keeping the existing snapshot.');
	process.exit(1);
}

await mkdir(CONTENT_DIR, { recursive: true });
await writeFile(
	path.join(CONTENT_DIR, '_repos.json'),
	JSON.stringify(meta, null, 2) + '\n',
	'utf-8'
);
console.log(`[sync-projects] Wrote ${meta.length} repos.`);
