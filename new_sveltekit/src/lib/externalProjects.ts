import type { ExternalProject } from './types';

// Projects that live on their own subdomain. They are excluded from
// scripts/sync-projects.mjs and shown here instead, ahead of the synced repos.
export const EXTERNAL_PROJECTS: ExternalProject[] = [
	{
		name: 'Spicetify extensions',
		description:
			'Docs for six Spicetify extensions for the Spotify desktop client: album lengths, folder and pin management, a listening list, local-file tags and RateYourMusic links.',
		url: 'https://spicetify.yusufaf.dev/',
		topics: ['spicetify', 'spotify']
	}
];
