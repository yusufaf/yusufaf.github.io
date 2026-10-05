export type ProjectEntry = {
	repo: string;
	fullName: string;
	description: string;
	homepage: string;
	topics: string[];
	language: string;
	stars: number;
	pushedAt: string;
	defaultBranch: string;
	readmeMarkdown: string;
	readmeSha: string;
	fetchedAt: string;
};

export type ProjectIndex = {
	slugs: string[];
	lastSyncAttempt: string;
	lastFullSyncSuccess: boolean;
	failedSlugs: string[];
};

// A curated entry that links out to a site of its own, instead of a README
// page rendered here. Hand-written; never touched by sync-projects.mjs.
export type ExternalProject = {
	name: string;
	description: string;
	url: string;
	topics: string[];
};
