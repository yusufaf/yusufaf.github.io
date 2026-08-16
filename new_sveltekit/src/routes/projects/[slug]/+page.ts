import { error } from '@sveltejs/kit';
import { Marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import DOMPurify from 'isomorphic-dompurify';
import type { ProjectEntry, ProjectIndex } from '$lib/types';

// Heading IDs matching GitHub's own slug scheme, so in-README anchor links
// (e.g. a table of contents linking to `#status`) resolve to a real element
// instead of tripping adapter-static's strict `handleMissingId` check.
const marked = new Marked().use(gfmHeadingId());

export const prerender = true;

const indexFiles = import.meta.glob<ProjectIndex>('/content/projects/_index.json', {
	eager: true,
	import: 'default'
});

const projectFiles = import.meta.glob<ProjectEntry>('/content/projects/*.json', {
	eager: true,
	import: 'default'
});

// `strict: true` on adapter-static needs every value the dynamic [slug]
// segment can take *before* crawling. Relying on the crawler discovering
// slugs via <a href> from /projects is fragile (breaks silently if that
// page ever paginates or lazy-loads) — entries() sourced from the manifest
// is the robust, documented pattern.
export function entries() {
	const index = Object.values(indexFiles)[0];
	return (index?.slugs ?? []).map((slug) => ({ slug }));
}

function isAbsoluteUrl(url: string): boolean {
	return /^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url);
}

// GitHub READMEs are full of paths relative to the repo root (screenshots,
// LICENSE, docs/*.md, …) that only resolve on github.com. Rendered verbatim
// on this site those 404 — rewrite them to point at the source repo instead
// of leaving broken images/links behind.
function rewriteRelativeUrls(html: string, fullName: string, defaultBranch: string): string {
	const branch = defaultBranch || 'main';
	return html
		.replace(/(<img[^>]+src=")([^"]+)(")/gi, (full, pre, url, post) => {
			if (isAbsoluteUrl(url)) return full;
			const cleaned = url.replace(/^\.\//, '');
			return `${pre}https://raw.githubusercontent.com/${fullName}/${branch}/${cleaned}${post}`;
		})
		.replace(/(<a[^>]+href=")([^"]+)(")/gi, (full, pre, url, post) => {
			if (isAbsoluteUrl(url)) return full;
			const cleaned = url.replace(/^\.\//, '');
			return `${pre}https://github.com/${fullName}/blob/${branch}/${cleaned}${post}`;
		});
}

export async function load({ params }) {
	const match = projectFiles[`/content/projects/${params.slug}.json`];

	if (!match) {
		error(404, 'Project not found');
	}

	const rawHtml = await marked.parse(match.readmeMarkdown);
	const rewritten = rewriteRelativeUrls(rawHtml, match.fullName, match.defaultBranch);
	const readmeHtml = DOMPurify.sanitize(rewritten);

	return { project: match, readmeHtml };
}
