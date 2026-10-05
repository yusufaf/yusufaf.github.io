import { EXTERNAL_PROJECTS } from '$lib/externalProjects';
import type { ProjectEntry } from '$lib/types';

export const prerender = true;

// Eagerly inline every cached project JSON file at build time — no runtime
// filesystem access, which is what a fully static (adapter-static) site
// needs. `_index.json` is excluded below since it's a manifest, not a
// project entry.
const files = import.meta.glob<ProjectEntry>('/content/projects/*.json', {
	eager: true,
	import: 'default'
});

export function load() {
	const projects = Object.entries(files)
		.filter(([filePath]) => !filePath.endsWith('_index.json'))
		.map(([, project]) => project)
		.sort((a, b) => new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime());

	return { externalProjects: EXTERNAL_PROJECTS, projects };
}
